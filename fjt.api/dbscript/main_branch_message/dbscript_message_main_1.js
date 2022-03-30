(function (newBuild) {
    var msgobj = {};
    switch (newBuild) {
        case 0:
            msgobj = {
                messageBuildNumber: 1,
                developer: "Fenil",
                message: [
                    {
                        messageCode: "RCV50016",
                        messageKey: "SHELF_LIFE_UPON_PART_MASTER",
                        messageType: "Information",
                        message: "Hint: In part master have configured shelf life days. so you need require to insert Date of Manufacture or Expire.",
                        category: "RECEIVING",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "U"
                    }
                ]
            };
            break;
        case 1:
            msgobj = {
                messageBuildNumber: 2,
                developer: "Fenil",
                message: [
                    {
                        messageCode: "RCV50017",
                        messageKey: "SHELF_LIFE_UPON_MOUNTING_GROUP",
                        messageType: "Information",
                        message: "Hint: This part is belong in Chemical Group Mouting Type. so you need require to insert Date of Manufacture or Expire.",
                        category: "RECEIVING",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "U"
                    }
                ]
            };
            break;
        case 2:
            msgobj = {
                messageBuildNumber: 3,
                developer: "Fenil",
                message: [
                    {
                        messageCode: "RCV20104",
                        messageKey: "PLANNED_KIT_REQUIRE_FIELD",
                        messageType: "Error",
                        message: "<b>{0}</b> are required.",
                        category: "RECEIVING",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 3:
            msgobj = {
                messageBuildNumber: 4,
                developer: "Fenil",
                message: [
                    {
                        messageCode: "RCV20105",
                        messageKey: "PLANNED_KIT_DATE_NOT_LESS_PO_DATE",
                        messageType: "Error",
                        message: "<b>{0}</b> cannot set to less than {1}.",
                        category: "RECEIVING",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 4:
            msgobj = {
                messageBuildNumber: 5,
                developer: "Fenil",
                message: [
                    {
                        messageCode: "RCV20106",
                        messageKey: "PLANNED_KIT_DATE_SHOULD_BE_LESS_TO_UPPER_ROW",
                        messageType: "Error",
                        message: "<b>{0}</b> should be less or equal to the <b>{0}</b> of row <b>{1}</b>.",
                        category: "RECEIVING",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 5:
            msgobj = {
                messageBuildNumber: 6,
                developer: "Fenil",
                message: [
                    {
                        messageCode: "RCV20107",
                        messageKey: "TOTAL_KITPOQTY_KITPOQTYVALIDATION",
                        messageType: "Error",
                        message: "Total of <b>Planned Kit & Planned Build Qty</b> and <b>Promised Ship Qty From PO</b> should be equal to <b>Kit Qty</b> and <b>PO Qty</b> respectively.",
                        category: "RECEIVING",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 6:
            msgobj = {
                messageBuildNumber: 7,
                developer: "Fenil",
                message: [
                    {
                        messageCode: "RCV20108",
                        messageKey: "TOTAL_KITQTY_KITQTYVALIDATION",
                        messageType: "Error",
                        message: "Total <b>Planned Kit & Planned Build Qty</b> should be equal to the <b>Kit Qty</b>.",
                        category: "RECEIVING",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 7:
            msgobj = {
                messageBuildNumber: 8,
                developer: "Fenil",
                message: [
                    {
                        messageCode: "RCV20109",
                        messageKey: "TOTAL_POQTY_POORDERQTYVALIDATION",
                        messageType: "Error",
                        message: "Total <b>Promised Ship Qty From PO</b> should be equal to the <b>PO Qty</b>.",
                        category: "RECEIVING",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 8:
            msgobj = {
                messageBuildNumber: 9,
                developer: "Fenil",
                message: [
                    {
                        messageCode: "GLB20038",
                        messageKey: "ACTIVE_ALERT_MESSAGE",
                        messageType: "Error",
                        message: "<b>{0}</b> already exists in record!",
                        category: "GLOBAL",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 9:
            msgobj = {
                messageBuildNumber: 10,
                developer: "Fenil",
                message: [
                    {
                        messageCode: "RCV20110",
                        messageKey: "DATE_VALIDATION",
                        messageType: "Error",
                        message: "{0} should be less or equal to the {1}.",
                        category: "RECEIVING",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 10:
            msgobj = {
                messageBuildNumber: 11,
                developer: "Fenil",
                message: [
                    {
                        messageCode: "RCV20111",
                        messageKey: "DATE_VALIDATION_PO",
                        messageType: "Error",
                        message: "{0} should be greater or equal to the PO Date.",
                        category: "RECEIVING",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 11:
            msgobj = {
                messageBuildNumber: 12,
                developer: "Fenil",
                message: [
                    {
                        messageCode: "GLB20039",
                        messageKey: "INVALID_DYNAMIC",
                        messageType: "Error",
                        message: "Invalid {0}!",
                        category: "GLOBAL",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 12:
            msgobj = {
                messageBuildNumber: 13,
                developer: "Fenil",
                message: [
                    {
                        messageCode: "RCV20112",
                        messageKey: "PLANNED_KIT_DATE_SHOULD_BE_LESS_TO_LOWER_ROW",
                        messageType: "Error",
                        message: "<b>{0}</b> of row <b>{1}</b> should be less or equal to the <b>{0}</b> of lower rows.",
                        category: "RECEIVING",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 13:
            msgobj = {
                messageBuildNumber: 14,
                developer: "Fenil",
                message: [
                    {
                        messageCode: "RCV20163",
                        messageKey: "INVALIDA_MFR_DATE_CODE",
                        messageType: "Error",
                        message: "You have enter Invalid format of <b>{0}</b>. Please check and insert correct format.",
                        category: "RECEIVING",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 14:
            msgobj = {
                messageBuildNumber: 15,
                developer: "Fenil",
                message: [
                    {
                        messageCode: "RCV40051",
                        messageKey: "CONFIRMATION_CONNTINUE_TR_UMID_COUNT",
                        messageType: "Confirmation",
                        message: "Entered count quantity is mismatched with the package quantity of part <b>{0}({1})</b> which is configured in Part Master. Are you sure you want to continue or press change packaging for change the packaging value.",
                        category: "RECEIVING",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 15:
            msgobj = {
                messageBuildNumber: 16,
                developer: "Fenil",
                message: [
                    {
                        messageCode: "RCV40052",
                        messageKey: "LESS_QTY_OF_PART_SUPPLIER",
                        messageType: "Confirmation",
                        message: "Entered quantity is greater than the minimum quantity of part <b>{0}({1})</b> configured in Part Master. Are you sure you want to add? Press Yes to continue.",
                        category: "RECEIVING",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 16:
            msgobj = {
                messageBuildNumber: 17,
                developer: "Fenil",
                message: [
                    {
                        messageCode: "RCV20171",
                        messageKey: "ERROR_INITIAL_POPUP_TR_UMID_COUNT",
                        messageType: "Error",
                        message: "Entered count quantity is mismatched with the package quantity of part <b>{0} ({1})</b> which is configured in Part Master. Please correct count quantity or select packaging other than <b>Tape & Reel</b> from UMID Management screen.",
                        category: "RECEIVING",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 17:
            msgobj = {
                messageBuildNumber: 18,
                developer: "Fenil",
                message: [
                    {
                        messageCode: "RCV40054",
                        messageKey: "CONFIRMATION_INITIAL_POPUP_TR_UMID_COUNT",
                        messageType: "Confirmation",
                        message: "Entered count quantity is mismatched with the package quantity of part <b>{0} ({1})</b> which is configured in Part Master. Are you sure you want to continue or press cancel for change the packaging value from UMID Management screen.",
                        category: "RECEIVING",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 18:
            msgobj = {
                messageBuildNumber: 19,
                developer: "Fenil",
                message: [
                    {
                        messageCode: "RCV20175",
                        messageKey: "BIN_CONTAIN_SAME_PS_PACKAGING_PART",
                        messageType: "Error",
                        message: "The <b>{0}</b> is packaging alias of <b>{1}</b> which is already in same Location/Bin <b>{2}</b> from packaging slip <b>{3} [{4}]</b>. <br/>Please select different Bin.",
                        category: "RECEIVING",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 19:
            msgobj = {
                messageBuildNumber: 20,
                developer: "Ashish",
                message: [
                    {
                        messageCode: "PRT20005",
                        messageKey: "COMP_EXISTS",
                        messageType: "Error",
                        message: "{0} with same {1} already exists.",
                        category: "PARTS",
                        modifiedDate: new Date(COMMON.getCurrentUTC()),
                        action: "U"
                    }
                ]
            };
            break;
        case 20:
            msgobj = {
                messageBuildNumber: 21,
                developer: "Fenil",
                message: [
                    {
                        messageCode: "RCV20180",
                        messageKey: "NOT_ALLOW_UPDATE_INVOICE_FOR_MEMO_LINE",
                        messageType: "Error",
                        message: "Credit or debit memo is already created for invoice line# <b>{0}</b> so you cannot update this line.",
                        category: "RECEIVING",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 21:
            msgobj = {
                messageBuildNumber: 22,
                developer: "Fenil",
                message: [
                    {
                        messageCode: "RCV20181",
                        messageKey: "NOT_ALLOW_UPDATE_PS_BASE_ON_INVOICE_STATUS",
                        messageType: "Error",
                        message: "You cannot <b>{0}</b> material detail, because invoice line# <b>{1}</b> status already <b>{2}</b>.",
                        category: "RECEIVING",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 22:
            msgobj = {
                messageBuildNumber: 23,
                developer: "Fenil",
                message: [
                    {
                        messageCode: "RCV50015",
                        messageKey: "RE_GET_PACKING_SLIP_LINE",
                        messageType: "Information",
                        message: "In packing slip# <b>{0}</b> have added <b>{1}</b> new line(s), updated <b>{2}</b> line(s) and removed <b>{3}</b> line(s). <br /> So, Please press <b>REGET INVOICE DETAIL</b> button to get updated invoice details.",
                        category: "RECEIVING",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "U"
                    }
                ]
            };
            break;
        case 23:
            msgobj = {
                messageBuildNumber: 24,
                developer: "Fenil",
                message: [
                    {
                        messageCode: "RCV50034",
                        messageKey: "RE_GET_PACKING_SLIP_LINE_ON_SOCKET_IO",
                        messageType: "Information",
                        message: "In packing slip# <b>{0}</b> have some changes at material details. <br /> So, Please press <b>REGET INVOICE DETAIL</b> button to get updated invoice details.",
                        category: "RECEIVING",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 24:
            msgobj = {
                messageBuildNumber: 25,
                developer: "Ashish",
                message: [
                    {
                        messageCode: "PRT40022",
                        messageKey: "CONFIRMATION_SAVE_PURCHASE_INSPECTION_TYPE",
                        messageType: "Confirmation",
                        message: "This part does contains some existing {0}, to merge with them click on Merge to Continue or to override existing click Override to Continue.",
                        category: "PARTS",
                        modifiedDate: new Date(COMMON.getCurrentUTC()),
                        action: "U"
                    }
                ]
            };
            break;
        case 25:
            msgobj = {
                messageBuildNumber: 26,
                developer: "Shweta",
                message: [
                    {
                        messageCode: "MST20066",
                        messageKey: "ENTITY_NAME_EXISTS",
                        messageType: "Error",
                        message: "{0} is already added as {1}.",
                        category: "MASTER",
                        modifiedDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 26:
            msgobj = {
                messageBuildNumber: 27,
                developer: "Fenil",
                message: [
                    {
                        messageCode: "RCV20182",
                        messageKey: "UMID_NOT_IN_SMART_CART_FOR_SHOW_LIGHT",
                        messageType: "Error",
                        message: "UMID <b>{0}</b> is not stored in a smart cart. Please select only those UMID which are stored in a smart cart.",
                        category: "RECEIVING",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 27:
            msgobj = {
                messageBuildNumber: 28,
                developer: "Fenil",
                message: [
                    {
                        messageCode: "RCV20183",
                        messageKey: "BOM_INTERNAL_VERSION_NOT_SET",
                        messageType: "Error",
                        message: "BOM internal version not set in BOM so please set internal version of BOM.",
                        category: "RECEIVING",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 28:
            msgobj = {
                messageBuildNumber: 29,
                developer: "Fenil",
                message: [
                    {
                        messageCode: "RCV40056",
                        messageKey: "CONFIRMATION_DEALLOCATE_MULTIPLE_UMID",
                        messageType: "Confirmation",
                        message: "Are you sure you want to deallocate the selected UMID(s)?",
                        category: "RECEIVING",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 29:
            msgobj = {
                messageBuildNumber: 30,
                developer: "Fenil",
                message: [
                    {
                        messageCode: "RCV20185",
                        messageKey: "UMID_NOT_CREATE_PART_TYPE_OTHER",
                        messageType: "Error",
                        message: "You cannot create UMID for part <b>{0}</b> as part type is <b>Other</b>.",
                        category: "RECEIVING",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 30:
            msgobj = {
                messageBuildNumber: 31,
                developer: "Ashish",
                message: [
                    {
                        messageCode: "RCV20186",
                        messageKey: "DUPLICATE_CHECK_NO",
                        messageType: "Error",
                        message: "Payment or Check Number already exists for same Bank Account#.",
                        category: "RECEIVING",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 31:
            msgobj = {
                messageBuildNumber: 32,
                developer: "Ashish",
                message: [
                    {
                        messageCode: "RCV20039",
                        messageKey: "NOT_PACKING_INVOICE",
                        messageType: "Error",
                        message: "From selected record(s) none of the record type is <b>Invoice</b>. Please check selected record(s).",
                        category: "RECEIVING",
                        modifiedDate: new Date(COMMON.getCurrentUTC()),
                        action: "U"
                    }
                ]
            };
            break;
        case 32:
            msgobj = {
                messageBuildNumber: 33,
                developer: "Ashish",
                message: [
                    {
                        messageCode: "RCV20037",
                        messageKey: "NOT_PAID",
                        messageType: "Error",
                        message: "From selected record(s) some of them are not <b>Approved To Pay</b> or already <b>Paid</b>. Please check selected record(s).",
                        category: "RECEIVING",
                        modifiedDate: new Date(COMMON.getCurrentUTC()),
                        action: "U"
                    }
                ]
            };
            break;
        case 33:
            msgobj = {
                messageBuildNumber: 34,
                developer: "Ashish",
                message: [
                    {
                        messageCode: "RCV20187",
                        messageKey: "PAYMENT_FILL_ACCOUNT_REF_IN_SUPPLIER_MASTER_FIRST",
                        messageType: "Error",
                        message: "Please add <b>Account Reference</b> at <b>Supplier</b> or please contact to Administrator.",
                        category: "RECEIVING",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 34:
            msgobj = {
                messageBuildNumber: 35,
                developer: "Ashish",
                message: [
                    {
                        messageCode: "RCV50035",
                        messageKey: "SUPPLIER_PAYMENT_VOIDED",
                        messageType: "Information",
                        message: "Supplier Invoice Payment Voided successfully.",
                        category: "RECEIVING",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 35:
            msgobj = {
                messageBuildNumber: 36,
                developer: "Ashish",
                message: [
                    {
                        messageCode: "RCV50036",
                        messageKey: "SUPPLIER_PAYMENT_RE_ISSUED",
                        messageType: "Information",
                        message: "Supplier Invoice Reissued successfully.",
                        category: "RECEIVING",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 36:
            msgobj = {
                messageBuildNumber: 37,
                developer: "Ashish",
                message: [
                    {
                        messageCode: "RCV50036",
                        messageKey: "SUPPLIER_PAYMENT_RE_ISSUED",
                        messageType: "Information",
                        message: "Supplier Invoice Payment Reissued successfully.",
                        category: "RECEIVING",
                        modifiedDate: new Date(COMMON.getCurrentUTC()),
                        action: "U"
                    }
                ]
            };
            break;
        case 37:
            msgobj = {
                messageBuildNumber: 38,
                developer: "Ashish",
                message: [
                    {
                        messageCode: "RCV10003",
                        messageKey: "SLIP_PAID",
                        messageType: "Success",
                        message: "Supplier Invoice paid successfully.",
                        category: "RECEIVING",
                        modifiedDate: new Date(COMMON.getCurrentUTC()),
                        action: "U"
                    }
                ]
            };
            break;
        case 38:
            msgobj = {
                messageBuildNumber: 39,
                developer: "Ashish",
                message: [
                    {
                        messageCode: "RCV20019",
                        messageKey: "SLIP_NOT_PAID",
                        messageType: "Error",
                        message: "Supplier Invoice payment was unsuccessful.",
                        category: "RECEIVING",
                        modifiedDate: new Date(COMMON.getCurrentUTC()),
                        action: "U"
                    }
                ]
            };
            break;
        case 39:
            msgobj = {
                messageBuildNumber: 40,
                developer: "Fenil",
                message: [
                    {
                        messageCode: "RCV20188",
                        messageKey: "PACAKGING_RECEIVE_QTY_NOT_MATCH_CHANGE_RECEIVE_QTY",
                        messageType: "Error",
                        message: "Receiving qty does not match with packaging qty. Please select correct received qty.",
                        category: "RECEIVING",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 40:
            msgobj = {
                messageBuildNumber: 41,
                developer: "Fenil",
                message: [
                    {
                        messageCode: "RCV20189",
                        messageKey: "PACKING_SLIP_IN_DRAFT_INVOICE_NOT_CREATE",
                        messageType: "Error",
                        message: "You cannot create supplier invoice as Packing slip <b>{0}</b> is in <b>Draft</b> mode.",
                        category: "RECEIVING",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 41:
            msgobj = {
                messageBuildNumber: 42,
                developer: "Fenil",
                message: [
                    {
                        messageCode: "RCV20190",
                        messageKey: "DRAFT_INVOICE_PS_NOT_PAY",
                        messageType: "Error",
                        message: "You cannot pay for selected invoice(s) as in selected record(s) packing slip# <b>{0}</b> is in <b>Draft</b> mode.",
                        category: "RECEIVING",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 42:
            msgobj = {
                messageBuildNumber: 43,
                developer: "Fenil",
                message: [
                    {
                        messageCode: "RCV20191",
                        messageKey: "RECEIVED_STATUS_NOT_SET_ACCEPT",
                        messageType: "Error",
                        message: "You cannot set received status as <b>Accepted</b> as Some lines status is <b>Pending</b> or <b>Reject</b> of packing slip material receive part instruction detail.",
                        category: "RECEIVING",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 43:
            msgobj = {
                messageBuildNumber: 44,
                developer: "Fenil",
                message: [
                    {
                        messageCode: "RCV20192",
                        messageKey: "RECEIVED_STATUS_NOT_SET_PENDING_REJECTED",
                        messageType: "Error",
                        message: "You cannot set received status as <b>{0}</b> as UMID is already created for this line.",
                        category: "RECEIVING",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 44:
            msgobj = {
                messageBuildNumber: 45,
                developer: "Fenil",
                message: [
                    {
                        messageCode: "RCV20193",
                        messageKey: "RECEIVED_STATUS_NOT_SET_AT_ADD_TIME",
                        messageType: "Error",
                        message: "You cannot set line level received status as you need to first set packing slip material receive part instruction detail status.",
                        category: "RECEIVING",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 45:
            msgobj = {
                messageBuildNumber: 46,
                developer: "Shirish",
                message: [
                    {
                        messageCode: "RFQ50024",
                        messageKey: "WITHOUT_SAVING_ALERT_BODY_MESSAGE_APPEND_BOM",
                        messageType: "Information",
                        message: "Please save changes in prior to append BOM.",
                        category: "RFQ",
                        modifiedDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 46:
            msgobj = {
                messageBuildNumber: 47,
                developer: "Ashish",
                message: [
                    {
                        messageCode: "RCV20196",
                        messageKey: "SELECT_AT_LEAST_ONE_INVOICE_STATUS_FILTER",
                        messageType: "Error",
                        message: "Please select at least one option from <b>Supplier Invoice Status</b>.",
                        category: "RECEIVING",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 47:
            msgobj = {
                messageBuildNumber: 48,
                developer: "Shubham",
                message: [
                    {
                        messageCode: "GLB20051",
                        messageKey: "UPLOAD_BLANK_CSV_EXCEL",
                        messageType: "Error",
                        message: "Uploaded {0} file is empty",
                        category: "GLOBAL",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 48:
            msgobj = {
                messageBuildNumber: 49,
                developer: "Shubham",
                message: [
                    {
                        messageCode: "GLB20052",
                        messageKey: "NO_RECORD_EXISTS",
                        messageType: "Error",
                        message: "Record does not exist please insert to prior to save.",
                        category: "GLOBAL",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 49:
            msgobj = {
                messageBuildNumber: 50,
                developer: "Fenil",
                message: [
                    {
                        messageCode: "RCV20210",
                        messageKey: "NOT_DELETE_RECORD_AS_STATUS_PAID",
                        messageType: "Error",
                        message: "You can not delete selected record(s), as from selected record(s) some record(s) status is <b>Paid</b>.",
                        category: "RECEIVING",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 50:
            msgobj = {
                messageBuildNumber: 51,
                developer: "Fenil",
                message: [
                    {
                        messageCode: "RCV20216",
                        messageKey: "NOT_CREATE_MEMO_ZERO_AMOUNT",
                        messageType: "Error",
                        message: "Cannot generate <b>{0}</b> of 0 amount.",
                        category: "RECEIVING",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 51:
            msgobj = {
                messageBuildNumber: 52,
                developer: "Fenil",
                message: [
                    {
                        messageCode: "RCV40068",
                        messageKey: "CONFIRMATION_MULTIPLE_DETAILS_LINES_MEMO",
                        messageType: "Confirmation",
                        message: "{0} <b>{1}</b> contains <b>{2}</b> lines. If you delete this {0} from here, it will delete only the details lines which are related to current invoice line number# <b>{3}</b>. <br />{0} <b>{1}</b> details will be removed. Press Yes to continue.",
                        category: "RECEIVING",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 52:
            msgobj = {
                messageBuildNumber: 53,
                developer: "Fenil",
                message: [
                    {
                        messageCode: "RCV20217",
                        messageKey: "PAID_MEMO_NOT_DELETE",
                        messageType: "Error",
                        message: "You cannot delete <b>{0}</b>, as {0} or supplier invoice of {0} status is <b>Paid</b>.",
                        category: "RECEIVING",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 53:
            msgobj = {
                messageBuildNumber: 54,
                developer: "Champak",
                message: [
                    {
                        messageCode: "RCV40067",
                        messageKey: "PO_STATUS_UPDATE_CONFIRMATION",
                        messageType: "Confirmation",
                        message: "Are you sure want to change the working status of PO# <b>{0}</b> from <b>{1}</b>  to <b>{2}</b>? Press Yes to Continue.",
                        category: "RECEIVING",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 54:
            msgobj = {
                messageBuildNumber: 55,
                developer: "Fenil",
                message: [
                    {
                        messageCode: "RCV40010",
                        messageKey: "MERGE_MEMO",
                        messageType: "Confirmation",
                        message: "For line# <b>{0}</b> already {1}# <b>{2}</b> is created for <b>{3} Line</b>. <br />Press ok to add <b>{4} line</b> into current {1}.",
                        category: "RECEIVING",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "U"
                    }
                ]
            };
            break;
        case 55:
            msgobj = {
                messageBuildNumber: 56,
                developer: "Champak",
                message: [
                    {
                        messageCode: "RCV40069",
                        messageKey: "TOTAL_RELEASE_RELEASECOUNT_MISMATC_CONFIRM",
                        messageType: "Confirmation",
                        message: "<b>Total Release Count</b> and <b>Qty</b> are modified and accordingly,<b>Total Release</b> will be modified. Are you sure you want to modify these release line details for PO# <b>{0}</b>? Press Yes to Continue.",
                        category: "RECEIVING",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 56:
            msgobj = {
                messageBuildNumber: 57,
                developer: "Champak",
                message: [
                    {
                        messageCode: "RCV20218",
                        messageKey: "TOTAL_POQTY_SHIPQTYVALIDATION",
                        messageType: "Error",
                        message: "Total <b>Release Qty From PO</b> should be equal to the <b>PO Qty</b>.",
                        category: "RECEIVING",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 57:
            msgobj = {
                messageBuildNumber: 58,
                developer: "Fenil",
                message: [
                    {
                        messageCode: "RCV20219",
                        messageKey: "MANUAL_MEMO_LINE_EXIST",
                        messageType: "Error",
                        message: "{0} line# already exists. Either you change {0} line# by clicking <b>CHANGE LINE#</b> button or click on <b>EDIT LINE</b> to continue.",
                        category: "RECEIVING",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 58:
            msgobj = {
                messageBuildNumber: 59,
                developer: "Shubham",
                message: [
                    {
                        messageCode: "MFG20094",
                        messageKey: "UPLOAD_CSV_EXCEL_WITH_ERROR_RECORD",
                        messageType: "Error",
                        message: "Data not imported. Uploaded {0} record(s) contain(s) errors. Please check error file for detail.<br>Total Record(s): <b>{1}</b>, Successfully Added Record(s): <b>{2}</b>, No of Record Skipped Record(s): <b>{3}</b>, No of Failure Record(s): <b>{4}</b>, No of Added As Alias: <b>{5}</b>, No of Updated Record(s): <b>{6}</b>",
                        category: "MFG",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "U"
                    }
                ]
            };
            break;
        case 59:
            msgobj = {
                messageBuildNumber: 60,
                developer: "Shubham",
                message: [
                    {
                        messageCode: "MFG20096",
                        messageKey: "UPLOAD_CSV_EXCEL_SUCCESSFULLY",
                        messageType: "Error",
                        message: "Data imported successfully.<br>Total Record(s): <b>{0}</b>, Successfully Added Record(s): <b>{1}</b>, No of Record Skipped Record(s): <b>{2}</b>, No of Failure Record(s): <b>{3}</b>, No of Added As Alias: <b>{4}</b>, No of Updated Record(s): <b>{5}</b>",
                        category: "MFG",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 60:
            msgobj = {
                messageBuildNumber: 61,
                developer: "Shubham",
                message: [
                    {
                        messageCode: "MFG20097",
                        messageKey: "UPLOAD_CSV_EXCEL_PARTIALLY",
                        messageType: "Error",
                        message: "Data partially imported, but some of the {0} record(s) contains error(s).Please check error file for detail. <br>Total Record(s): <b>{1}</b>, Successfully Added Record(s): <b>{2}</b>, No of Record Skipped Record(s): <b>{3}</b>, No of Failure Record(s): <b>{4}</b>, No of Added As Alias: <b>{5}</b>, No of Updated Record(s): <b>{6}</b>",
                        category: "MFG",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 61:
            msgobj = {
                messageBuildNumber: 62,
                developer: "Shubham",
                message: [
                    {
                        messageCode: "MFG20098",
                        messageKey: "UPLOAD_DATA_INCORRECT",
                        messageType: "Error",
                        message: "Uploaded file contains error(s). Please upload corrected data file only",
                        category: "MFG",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 62:
            msgobj = {
                messageBuildNumber: 63,
                developer: "Shubham",
                message: [
                    {
                        messageCode: "MFG20095",
                        messageKey: "SAVE_MFR_WITH_DEFUALT_VALUE",
                        messageType: "Error",
                        message: "The {0} for the data you are importing will be set as <b>'{1}'</b>. Are you sure? Press Yes to continue.<br>By pressing 'NO', you have to reinsert the data in the import format, again.",
                        category: "MFG",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 63:
            msgobj = {
                messageBuildNumber: 64,
                developer: "Fenil",
                message: [
                    {
                        messageCode: "RCV20220",
                        messageKey: "RMA_QTY_SHIPPED_QTY_NOT_MORE_PS_QTY_RECEIVED_QTY",
                        messageType: "Error",
                        message: "<b>RMA Qty</b> or <b>Shipped Qty</b> does not allow more than Packing slip or Received Qty of Packing Slip# <b>{0}</b>.",
                        category: "RECEIVING",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 64:
            msgobj = {
                messageBuildNumber: 65,
                developer: "Shubham",
                message: [
                    {
                        messageCode: "MST40030",
                        messageKey: "IMPORT_CUSTOMER_DETAIL_UPDATE_CONFIRMATION",
                        messageType: "Confirmation",
                        message: "Following {0} are already added in system, have to update existing record?<br>Press <b>Yes</b> to continue with update existing data or press <b>No</b> to upload only not exists data.",
                        category: "MASTER",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "U"
                    }
                ]
            };
            break;
        case 65:
            msgobj = {
                messageBuildNumber: 66,
                developer: "Shubham",
                message: [
                    {
                        messageCode: "MFG20105",
                        messageKey: "DUPLICATE_MFR_RECORD_IN_FILE",
                        messageType: "Error",
                        message: "{0} has a duplicate value(s) in the file",
                        category: "MFG",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 66:
            msgobj = {
                messageBuildNumber: 67,
                developer: "Ashish",
                message: [
                    {
                        messageKey: "SUPPLIER_INVOICE_ZERO_PAYMENT_CONFIRMATION",
                        category: "RECEIVING",
                        messageType: "Confirmation",
                        messageCode: "RCV40070",
                        message: "Are you sure you want do payment for zero amount? Press Yes to continue.",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 67:
            msgobj = {
                messageBuildNumber: 68,
                developer: "Shweta",
                message: [
                    {
                        messageKey: "CORRECTEDINVOICED_STATUS_CANNOT_CHANGED",
                        category: "MFG",
                        messageType: "Error",
                        messageCode: "MFG20103",
                        message: "Action \'Change Status\' not permitted for one of following reasons.<br/> 1. If current status is <b>\'Invoiced\'</b> and changing to <b>\'Shipped - Not Invoiced\'</b>.<br/>2. If current status is <b>\'Corrected & Invoiced\'</b> and changing to <b>\'Shipped - Not Invoiced\'</b>.<br/>3. If current status is <b>\'Corrected & Invoiced\'</b> and changing to <b>\'Invoiced\'</b>.",
                        modifiedDate: new Date(COMMON.getCurrentUTC()),
                        action: "U"
                    }
                ]
            };
            break;
        case 68:
            msgobj = {
                messageBuildNumber: 69,
                developer: "Shweta",
                message: [
                    {
                        messageCode: "MFG20111",
                        messageKey: "PUBLISH_WITHOUT_DETAILS",
                        messageType: "Error",
                        message: "To prior to {1} {0}, you need to add details first.",
                        category: "MFG",
                        modifiedDate: new Date(COMMON.getCurrentUTC()),
                        action: "U"
                    }
                ]
            };
            break;
        case 69:
            msgobj = {
                messageBuildNumber: 70,
                developer: "Ashish",
                message: [
                    {
                        messageKey: "ZERO_AMOUNT_INVOICE_SELECTED_FOR_SUPPLIER_INVOICE_PAYMENT",
                        category: "RECEIVING",
                        messageType: "Confirmation",
                        messageCode: "RCV40071",
                        message: "You have selected a Zero amount invoice, Are you sure want to continue? Press Yes to Continue.",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 70:
            msgobj = {
                messageBuildNumber: 71,
                developer: "Charmi",
                message: [
                    {
                        messageCode: "GLB40031",
                        messageKey: "WITHOUT_SAVING_ALERT_PUBLISHED_TEMPLATE_MESSAGE",
                        messageType: "Confirmation",
                        message: "You will lose all unsaved work.<br/> Are you sure you want to publish this template?",
                        category: "GLOBAL",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 71:
            msgobj = {
                messageBuildNumber: 72,
                developer: "Ketan",
                message: [
                    {
                        messageCode: "GLB20057",
                        messageKey: "DATE_LESS_THAN_EQUAL_TO",
                        messageType: "Error",
                        message: "{0} should be less or equal to the {1}.",
                        category: "GLOBAL",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 72:
            msgobj = {
                messageBuildNumber: 73,
                developer: "Ketan",
                message: [
                    {
                        messageCode: "MFG20113",
                        messageKey: "CUST_PAYMENT_ALREADY_LOCKED_FOR_LOCK",
                        messageType: "Error",
                        message: "Selected customer payment(s) already <b>locked</b>. You can not lock again.",
                        category: "MFG",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 73:
            msgobj = {
                messageBuildNumber: 74,
                developer: "Ketan",
                message: [
                    {
                        messageCode: "MFG20114",
                        messageKey: "CUST_PAY_ALREADY_LOCKED_DELETE_DENIED",
                        messageType: "Error",
                        message: "Selected customer payment(s) are <b>locked</b>. You can not delete customer payment.",
                        category: "MFG",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 74:
            msgobj = {
                messageBuildNumber: 75,
                developer: "Ketan",
                message: [
                    {
                        messageCode: "MFG40036",
                        messageKey: "CHANGE_IN_LOCKED_CUST_PAYMENT_CONFM",
                        messageType: "Confirmation",
                        message: "Customer payment is already locked. Still you want to change?",
                        category: "MFG",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;

        case 75:
            msgobj = {
                messageBuildNumber: 76,
                developer: "Charmi",
                message: [
                    {
                        messageCode: "GLB40035",
                        messageKey: "WITHOUT_SAVING_ALERT_VERSION_MESSAGE",
                        messageType: "Confirmation",
                        message: "You will lose all unsaved work.<br/>Are you sure you want to switch the version?",
                        category: "GLOBAL",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 76:
            msgobj = {
                messageBuildNumber: 77,
                developer: "Charmi",
                message: [
                    {
                        messageCode: "GLB40030",
                        messageKey: "PERMENANT_DELETE_CONFIRM_MESSAGE",
                        messageType: "Confirmation",
                        message: "Are you sure you want to permanently delete this {0}?",
                        category: "GLOBAL",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "U"
                    }
                ]
            };
            break;
        case 77:
            msgobj = {
                messageBuildNumber: 78,
                developer: "Charmi",
                message: [
                    {
                        messageCode: "GLB40032",
                        messageKey: "RECYCLE_CONFIRM_MESSAGE",
                        messageType: "Confirmation",
                        message: "Are you sure you want to move this {0} to Recycle Bin?",
                        category: "GLOBAL",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 78:
            msgobj = {
                messageBuildNumber: 79,
                developer: "Charmi",
                message: [
                    {
                        messageCode: "GLB40033",
                        messageKey: "MULTIPLE_RECYCLE_CONFIRM_MESSAGE",
                        messageType: "Confirmation",
                        message: "Are you sure you want to move this {0} items to Recycle Bin?",
                        category: "GLOBAL",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 79:
            msgobj = {
                messageBuildNumber: 80,
                developer: "Charmi",
                message: [
                    {
                        messageCode: "GLB40034",
                        messageKey: "MULTIPLE_PERMENANT_DELETE_CONFIRM_MESSAGE",
                        messageType: "Confirmation",
                        message: "Are you sure you want to permanently delete these {0} items?",
                        category: "GLOBAL",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 80:
            msgobj = {
                messageBuildNumber: 81,
                developer: "Shubham",
                message: [
                    {
                        messageCode: "PRT20041",
                        messageKey: "INVALID_SEARCH_PART",
                        messageType: "Error",
                        message: "You are searching {0} Part <b>{1}</b> on {2} Part page. You will be redirected to the correct {3} Part page.",
                        category: "GLOBAL",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 81:
            msgobj = {
                messageBuildNumber: 82,
                developer: "Shubham",
                message: [
                    {
                        messageKey: "INVALID_SEARCH_PART",
                        messageCode: "PRT20041",
                        category: "GLOBAL",
                        deletedDate: new Date(COMMON.getCurrentUTC()),
                        action: "D"
                    }
                ]
            };
            break;
        case 82:
            msgobj = {
                messageBuildNumber: 83,
                developer: "Shubham",
                message: [
                    {
                        messageCode: "PRT20041",
                        messageKey: "INVALID_SEARCH_PART",
                        messageType: "Error",
                        message: "You are searching {0} Part <b>{1}</b> on {2} Part page. You will be redirected to the correct {3} Part page.",
                        category: "PARTS",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 83:
            msgobj = {
                messageBuildNumber: 84,
                developer: "Champak",
                message: [
                    {
                        messageCode: "MFG20120",
                        messageKey: "CUSTOMER_PACKINGSLIP_SO_STATUS_ALERT",
                        messageType: "Error",
                        message: "You cannot create the customer packing slip for SO# <b>{0}</b>. Because it is in <b>Draft</b> mode. Please change the sales order status from <b>Draft</b> to <b>Published</b> and proceed further.",
                        category: "MFG",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 84:
            msgobj = {
                messageBuildNumber: 85,
                developer: "Champak",
                message: [
                    {
                        messageCode: "MFG20121",
                        messageKey: "SALESORDER_UPDATE_RESTRICTED_AFTER_PACKINGSLIP",
                        messageType: "Error",
                        message: "Changing the sales order status from <b>Published</b> to <b>Draft</b> is restricted as packing slip already created for selected SO# <b>{0}</b>.",
                        category: "MFG",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 85:
            msgobj = {
                messageBuildNumber: 86,
                developer: "Charmi",
                message: [
                    {
                        messageCode: "RCV30017",
                        messageKey: "COUNT_MATERIAL_CONFIRMATION_KIT_NOT_RELEASED",
                        messageType: "Warning",
                        message: "Contact Supervisor! <br/> Kit release is pending for this UMID. Entering new count may create shortage. System will deallocate stock from the kit for this UMID.",
                        category: "RECEIVING",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "U"
                    }
                ]
            };
            break;
        case 86:
            msgobj = {
                messageBuildNumber: 87,
                developer: "Charmi",
                message: [
                    {
                        messageCode: "RCV40034",
                        messageKey: "COUNT_MATERIAL_CONFIRMATION_WITH_SELECTED_KIT",
                        messageType: "Confirmation",
                        message: "<b>{0}</b> have <b>{1} {2}</b> {3} <b>{4}</b>. {5}",
                        category: "RECEIVING",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "U"
                    }
                ]
            };
            break;
        case 87:
            msgobj = {
                messageBuildNumber: 88,
                developer: "Champak",
                message: [
                    {
                        messageCode: "MFG20126",
                        messageKey: "SO_SHIPPING_RELEASE_NOT_UPDATE",
                        messageType: "Error",
                        message: "Release Line ID <b>{0}</b> cannot be update because, It is already shipped for customer packing slip(s) <b>{1}</b>.",
                        category: "MFG",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 88:
            msgobj = {
                messageBuildNumber: 89,
                developer: "Charmi",
                message: [
                    {
                        messageCode: "RCV30012",
                        messageKey: "APPROVED_TO_DEALLOCATE_FROM_KIT_WARNING",
                        messageType: "Warning",
                        message: "Consumption is more than allocated quantity and free to allocate quantity from UMID. So the system will be deallocated stock from below kits based on farthest promised shipped date.",
                        category: "RECEIVING",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "U"
                    }
                ]
            };
            break;
        case 89:
            msgobj = {
                messageBuildNumber: 90,
                developer: "Champak",
                message: [
                    {
                        messageCode: "RCV30012",
                        messageKey: "PO_SO_MISMATCH_IN_PACKINGSLIP",
                        messageType: "Error",
                        message: "You cannot update the SO# <b>{0}</b> in PO# <b>{1}</b>. Because the SO# <b>{0}</b> is not matching with the SO# <b>{2}</b> mentioned in the Material Receipt <b>{3}</b>. Please use the same SO# mentioned in the Material Receipt or remove the Material Receipt entry and recreate with the correct SO#.",
                        category: "RECEIVING",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 90:
            msgobj = {
                messageBuildNumber: 91,
                developer: 'Vaibhav',
                message: [{
                    messageCode: 'MFG20017',
                    messageKey: 'OPENING_STOCK_MUST_BE_GREATER_THAN_ZERO',
                    messageType: "Error",
                    message: 'Initial stock must be greater than zero.',
                    category: 'MFG',
                    createdDate: new Date(COMMON.getCurrentUTC()),
                    action: 'U'
                }]
            };
            break;
        case 91:
            msgobj = {
                messageBuildNumber: 92,
                developer: 'Vaibhav',
                message: [{
                    messageCode: 'MFG20087',
                    messageKey: 'NOT_ALLOW_TO_REDUCE_OPENING_STOCK_QTY_THAN_UMID_SHIPPED_QTY',
                    messageType: 'Error',
                    message: 'Initial Stock Qty cannot less than Shipped Qty and UMID Stock. i.e., {0}.',
                    category: 'MFG',
                    createdDate: new Date(COMMON.getCurrentUTC()),
                    action: 'U'
                }]
            };
            break;
        case 92:
            msgobj = {
                messageBuildNumber: 93,
                developer: "Vaibhav",
                message: [{
                    messageCode: 'MFG20055',
                    messageKey: 'NOT_ALLOW_TO_REDUCE_OPENING_STOCK_QTY_THAN_UMID_QTY',
                    messageType: 'Error',
                    message: 'You cannot update initial stock quantity less than UMID created quantity i.e., <b>{0}</b>.',
                    category: 'MFG',
                    createdDate: new Date(COMMON.getCurrentUTC()),
                    action: 'U'
                }]
            };
            break;
        case 93:
            msgobj = {
                messageBuildNumber: 94,
                developer: "Charmi",
                message: [
                    {
                        messageCode: "RCV40050",
                        messageKey: "TRANSFER_UNALLOCATED_UMID_WITH_PASSWORD_CONFIRMATION",
                        messageType: "Confirmation",
                        message: "Please enter password and reason to transfer unallocated UMID: <b>{0}</b> from <b>{1}</b> to <b>{2}</b>.",
                        category: "RECEIVING",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "U"
                    }
                ]
            };
            break;
        case 94:
            msgobj = {
                messageBuildNumber: 95,
                developer: "Charmi",
                message: [
                    {
                        messageCode: "RCV20153",
                        messageKey: "REEL_MISMATCH",
                        messageType: "Warning",
                        message: "Selected UMID <b>{0}</b> and scanned UMID <b>{1}</b> are mismatched.",
                        category: "RECEIVING",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "U"
                    }
                ]
            };
            break;
        case 95:
            msgobj = {
                messageBuildNumber: 96,
                developer: "Charmi",
                message: [
                    {
                        messageCode: "RCV30018",
                        messageKey: "ENTER_COUNT_MORE_THAN_CURRENT_COUNT",
                        messageType: "Warning",
                        message: "Entered quantity is incorrect. Consult supervisor for further help to adjust the quantity.",
                        category: "RECEIVING",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 96:
            msgobj = {
                messageBuildNumber: 97,
                developer: "Ketan",
                message: [
                    {
                        messageCode: "MFG20127",
                        messageKey: "CUST_PAY_LOCK_STATE_INV_AMT_MISMATCH",
                        messageType: "Error",
                        message: "Customer payment is already locked. Total amount of selected invoice must be equal to main payment amount.",
                        category: "MFG",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 97:
            msgobj = {
                messageBuildNumber: 98,
                developer: "Ketan",
                message: [
                    {
                        messageCode: "MFG50060",
                        messageKey: "SELECT_ONE_ZERO_AMT_INV_CUST_PAYMENT",
                        messageType: "Information",
                        message: "Please select at least one invoice for Closeout Zero Values Invoices.",
                        category: "MFG",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 98:
            msgobj = {
                messageBuildNumber: 99,
                developer: "Ketan",
                message: [
                    {
                        messageCode: "MFG20108",
                        messageKey: "INV_AMT_NOT_MORE_THAN_ACTUAL_PAY_AMT",
                        messageType: "Error",
                        message: "<b>Total Amount of the selected invoice(s)</b> must be less than or equal to <b>Payment Amount</b>. Please update Invoice Amount or re-select the Invoice accordingly.",
                        category: "MFG",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "U"
                    }
                ]
            };
            break;
        case 99:
            msgobj = {
                messageBuildNumber: 100,
                developer: "Ketan",
                message: [
                    {
                        messageCode: "MFG20122",
                        messageKey: "CUST_PAYMENT_PENDING_ADJUSTMENT_AMT_FOR_LOCK",
                        messageType: "Error",
                        message: "{0} customer payment(s) contain payment variance. You can not lock.",
                        category: "MFG",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "U"
                    }
                ]
            };
            break;


        case 100:
            msgobj = {
                messageBuildNumber: 101,
                developer: "Purav",
                message: [
                    {
                        messageCode: "RCV50041",
                        messageKey: "PO_STATUS_IN_DRAFT_MODE",
                        messageType: "Information",
                        message: "You cannot create the packing slip for PO# {0}. Because it is in <b>Draft</b> mode. Please change the purchase order status from <b>Draft</b> to <b>Published</b> and proceed further.",
                        category: "RECEIVING",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "U"
                    }
                ]
            };
            break;


        case 101:
            msgobj = {
                messageBuildNumber: 102,
                developer: "Purav",
                message: [
                    {
                        messageCode: "RCV20243",
                        messageKey: "CHECK_RELEASE_QTY_DIFFER_LINE_VALIDATION",
                        messageType: "Information",
                        message: "You cannot merge the PO Line ID <b>{0}</b> release(s) with <b>{1}</b>. You are allowed to merge the release for the same PO Line(s).",
                        category: "RECEIVING",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "U"
                    }
                ]
            };
            break;

        case 102:
            msgobj = {
                messageBuildNumber: 103,
                developer: "Purav",
                message: [
                    {
                        messageCode: "RCV50042",
                        messageKey: "PART_DO_NOT_EXIST_IN_PO_LINE",
                        messageType: "Information",
                        message: "You cannot add material detail for the part <b>({0})<b> <b>{1}</b> in this packing slip as the selected part is not ordered in associated PO# {2}.",
                        category: "RECEIVING",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "U"
                    }
                ]
            };
            break;

        case 103:
            msgobj = {
                messageBuildNumber: 104,
                developer: "Purav",
                message: [
                    {
                        messageCode: "RCV30019",
                        messageKey: "SO_MISMATCHED_FROM_PO",
                        messageType: "warning",
                        message: "SO# <b>{0}</b> is mismatched with SO# <b>{1}</b> of PO# {2}. Please use the same SO# mentioned in the Purchase Order or update it with the correct SO#.",
                        category: "RECEIVING",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 104:
            msgobj = {
                messageBuildNumber: 105,
                developer: "Ashish",
                message: [
                    {
                        messageKey: "SUPPLIER_INVOICE_LINE_DETAILS_RESET_CONFIRMTION",
                        category: "RECEIVING",
                        messageType: "Confirmation",
                        messageCode: "RCV40077",
                        message: "You will lose all unsaved changes for Invoice Line Detail.<br/> Are you sure you want to open a line variance approval popup?",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 105:
            msgobj = {
                messageBuildNumber: 106,
                developer: "Ashish",
                message: [
                    {
                        messageKey: "NOT_ALLOWED_TO_CREATE_MEMO_FOR_INVOICE_LINE",
                        category: "RECEIVING",
                        messageType: "Error",
                        messageCode: "RCV20249",
                        message: "Credit or debit memo is already created for <b>{0}</b>, please check and try again.",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 106:
            msgobj = {
                messageBuildNumber: 107,
                developer: "Champak",
                message: [
                    {
                        messageKey: "PO_ALREADY_COMPLETED",
                        category: "RECEIVING",
                        messageType: "Error",
                        messageCode: "RCV20247",
                        message: "You cannot change the PO. Because the PO# <b>{0}</b> is already completed.",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 107:
            msgobj = {
                messageBuildNumber: 108,
                developer: "Champak",
                message: [
                    {
                        messageKey: "SO_ALREADY_EXIST_SUPPLIER",
                        category: "RECEIVING",
                        messageType: "Error",
                        messageCode: "RCV20248",
                        message: "SO# <b>{0}</b> already exists for supplier <b>{1}</b> for PO# <b>{2}</b>.",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 108:
            msgobj = {
                messageBuildNumber: 109,
                developer: "Champak",
                message: [
                    {
                        messageKey: "PO_SO_MISMATCH_CONFIRMATION",
                        category: "RECEIVING",
                        messageType: "Confirmation",
                        messageCode: "RCV40078",
                        message: "SO# <b>{0}</b> you are updating in PO <b>{1}</b> is not matching with the SO# <b>{2}</b> of Material Receipt <b>{3}</b>. Are you sure to continue with the SO# <b>{0}</b> mentioned in the PO#  <b>{1}</b>? Press Yes to Continue.",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 109:
            msgobj = {
                messageBuildNumber: 110,
                developer: "Champak",
                message: [
                    {
                        messageKey: "POQTY_PACKAGING_VALIDATION_POLINE",
                        category: "RECEIVING",
                        messageType: "Error",
                        messageCode: "RCV20251",
                        message: "PO Qty does not match with <b>Packaging Min Qty</b>. Please either update the <b>PO Qty</b> or select the correct <b>Packaging</b>.",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 110:
            msgobj = {
                messageBuildNumber: 111,
                developer: "Champak",
                message: [
                    {
                        messageKey: "POQTY_PACKAGING_VALIDATION_POLINE_RELEASE",
                        category: "RECEIVING",
                        messageType: "Error",
                        messageCode: "RCV20252",
                        message: "Release Qty does not match with <b>Packaging Min Qty</b>. Please  update the <b>Release Qty</b>.",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;

        case 111:
            msgobj = {
                messageBuildNumber: 112,
                developer: "Purav",
                message: [
                    {
                        messageKey: "WRONG_PART_CNF_FOR_PART_IN_PO",
                        category: "RECEIVING",
                        messageType: "Error",
                        messageCode: "RCV20250",
                        message: "The part <b>{0}</b> is selected as <b>Received Wrong Part</b> which is present in PO#{1}.",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;

        case 112:
            msgobj = {
                messageBuildNumber: 113,
                developer: "Purav",
                message: [
                    {
                        messageKey: "WRONG_PART_IS_UNCHECKED",
                        category: "RECEIVING",
                        messageType: "Error",
                        messageCode: "RCV20254",
                        message: "The part <b>{0}</b> dosnt exists in PO#{1}. Please select checkbox <b> isWrongPart </b> to continue.",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;

        case 113:
            msgobj = {
                messageBuildNumber: 114,
                developer: "Purav",
                message: [
                    {
                        messageCode: "RCV50042",
                        messageKey: "PART_DO_NOT_EXIST_IN_PO_LINE",
                        messageType: "Information",
                        message: "You cannot add material detail for the part <b>({0}) {1}</b> in this packing slip as the selected part is not ordered in associated PO# {2}.",
                        category: "RECEIVING",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "U"
                    }
                ]
            };
            break;

        case 114:
            msgobj = {
                messageBuildNumber: 115,
                developer: "Purav",
                message: [
                    {
                        messageKey: "WRONG_PART_IS_UNCHECKED",
                        category: "RECEIVING",
                        messageType: "Error",
                        messageCode: "RCV20254",
                        message: "The part <b>{0}</b> dosnt exists in PO#{1}. Please select checkbox <b> Received Wrong Part </b> to continue.",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "U"
                    }
                ]
            };
            break;
        case 115:
            msgobj = {
                messageBuildNumber: 116,
                developer: "Champak",
                message: [
                    {
                        messageKey: "PO_RELEASE_LINE_QTY_CONFIRMATION",
                        category: "RECEIVING",
                        messageType: "Confirmation",
                        messageCode: "RCV40079",
                        message: "PO Qty does not match with <b>Packaging Qty</b>. It should match with <b>Min {0} Qty</b> or <b> Multiply of Mult Qty {1}</b> of the Packaging Qty. Following are the reasons for mismatch: <br />1) Due to part data are not accurate in the Part Master. Would you like to update the Part Master data for <b>{2}</b> ? <br />2) Due to Supplier Part does not exist in the Part Master for selected Packaging. Do you want to create the Supplier Part? <br />3) Are you sure you want to continue with mismatched Packaging Qty? Press Yes yo Continue. <br />",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 116:
            msgobj = {
                messageBuildNumber: 117,
                developer: "Champak",
                message: [
                    {
                        messageKey: "RELEASE_LINE_QTY_MISMATCH_CONFIRMATION",
                        category: "RECEIVING",
                        messageType: "Confirmation",
                        messageCode: "RCV40080",
                        message: "Release Qty does not match with <b>Packaging Qty</b>. It should match with <b>Min Qty {0}</b> or <b>Multiply of Mult Qty {1}</b> of the Supplier Packaging Qty. Are you sure you want to continue with mismatched Packaging Qty? Press Yes to Continue.",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 117:
            msgobj = {
                messageBuildNumber: 118,
                developer: "Ashish",
                message: [
                    {
                        messageKey: "DB_TRANSACTION_LOCKED_MESSAGE",
                        category: "GLOBAL",
                        messageType: "Error",
                        messageCode: "GLB20061",
                        message: "The transaction is locked for some time due to excessive requests, please try again!",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 118:
            msgobj = {
                messageBuildNumber: 119,
                developer: "Champak",
                message: [
                    {
                        messageKey: "EXTERNAL_SERVICE_NOT_STARTED",
                        category: "GLOBAL",
                        messageType: "Error",
                        messageCode: "GLB20059",
                        message: "{0} service is currently not running. Please start or restart the service.",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 119:
            msgobj = {
                messageBuildNumber: 120,
                developer: "Dharmishtha",
                message: [
                    {
                        messageCode: "RCV50042",
                        messageKey: "PART_DO_NOT_EXIST_IN_PO_LINE",
                        messageType: "Information",
                        category: "RECEIVING",
                        modifiedDate: new Date(COMMON.getCurrentUTC()),
                        action: "D"
                    }
                ]
            };
            break;
        case 120:
            msgobj = {
                messageBuildNumber: 121,
                developer: "Dharmishtha",
                message: [
                    {
                        messageCode: "RCV40081",
                        messageKey: "PART_DO_NOT_EXIST_IN_PO_LINE",
                        messageType: "Confirmation",
                        message: "You are adding the part <b>({0})</b> <b>{1}</b> in this packing slip which is not ordered in the associated PO# <b>{2}</b>.<br />Would you like to receive this part as a Received Wrong Part?",
                        category: "RECEIVING",
                        modifiedDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 121:
            msgobj = {
                messageBuildNumber: 122,
                developer: "Dharmishtha",
                message: [
                    {
                        messageCode: "RCV40082",
                        messageKey: "PACKING_SLIP_SO_MISMATCH_WITH_PO_FROM_PURCHASE_ORDER",
                        messageType: "Confirmation",
                        message: "Entered SO# <b>{0}</b> in this packing slip is mismatched with SO# from associated PO# <b>{1}</b>.<br />Are you sure you want to continue with SO# <b>{0}</b>?",
                        category: "RECEIVING",
                        modifiedDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 122:
            msgobj = {
                messageBuildNumber: 123,
                developer: "Dharmishtha",
                message: [
                    {
                        messageCode: "RCV40083",
                        messageKey: "PACKING_SLIP_SO_MISMATCH_WITH_PO_FROM_OTHER_PACKING_SLIP",
                        messageType: "Confirmation",
                        message: "Entered SO# <b>{0}</b> in this packing slip is mismatched with SO# of packing slip created with the same PO# <b>{1}</b>.<br />Are you sure you want to continue with SO# <b>{0}</b>?",
                        category: "RECEIVING",
                        modifiedDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 123:
            msgobj = {
                messageBuildNumber: 124,
                developer: "Champak",
                message: [
                    {
                        messageCode: "RCV40064",
                        messageKey: "PO_STATUS_REVISION_CHANGE_CONFIRMATION",
                        messageType: "Confirmation",
                        message: "Purchase Order updated with <b>Published</b> status. Do you want to upgrade the PO Revision?",
                        category: "RECEIVING",
                        modifiedDate: new Date(COMMON.getCurrentUTC()),
                        action: "U"
                    }
                ]
            };
            break;
        case 124:
            msgobj = {
                messageBuildNumber: 125,
                developer: "Shweta",
                message: [
                    {
                        messageKey: "GET_LATEST_PART_DESCRIPTION_CONFIRMATION",
                        category: "GLOBAL",
                        messageType: "Confirmation",
                        messageCode: "GLB40039",
                        message: "Existing description will be overwrite by part master description. Are you sure to refresh the description? Press yes to continue.",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 125:
            msgobj = {
                messageBuildNumber: 126,
                developer: "Shweta",
                message: [
                    {
                        messageKey: "PUBLISHED_TRANS_UPDATE_REVISION_CONFIRMATION",
                        category: "GLOBAL",
                        messageType: "Confirmation",
                        messageCode: "GLB40040",
                        message: "{0} already in status {1}. Do you want to upgrade {0} Revision? Press Yes to Continue.",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 126:
            msgobj = {
                messageBuildNumber: 127,
                developer: "Shweta",
                message: [
                    {
                        messageKey: "ASSEMBLY_RFQ_ONLY_ERROR",
                        category: "MFG",
                        messageType: "Error",
                        messageCode: "MFG20128",
                        message: "Selected <b>{0}</b> is configured as 'RFQ Only', Please update part master configuration.",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 127:
            msgobj = {
                messageBuildNumber: 128,
                developer: "Shweta",
                message: [
                    {
                        messageKey: "PACKINGSLIP_STATUS_NOT_SHIPPED",
                        category: "MFG",
                        messageType: "Error",
                        messageCode: "MFG20129",
                        message: "In order to change Customer Invoice status to <b>{0}</b>, Customer Packing status must be <b>Shipped</b>.",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 128:
            msgobj = {
                messageBuildNumber: 129,
                developer: "Shweta",
                message: [
                    {
                        messageKey: "MISC_PACKINGSLIP_SO_ALREADY_EXISTS_CONFIRMATION",
                        category: "MFG",
                        messageType: "Error",
                        messageCode: "MFG40043",
                        message: "You have selected MISC Customer Packing Slip and SO# <b>{0}</b> or PO# <b>{1}</b> already  exists in Sales Order. Are you sure to Continue ? Press Yes to Continue.",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 129:
            msgobj = {
                messageBuildNumber: 130,
                developer: "Shweta",
                message: [
                    {
                        messageKey: "CORRECTEDINVOICED_STATUS_CANNOT_CHANGED",
                        category: "MFG",
                        messageType: "Error",
                        messageCode: "MFG20103",
                        message: "Action 'Change Status' not permitted for one of following reasons.<br/>1. If current status  is <b>'Shipped - Not Invoiced'</b> and changing to <b>'Draft'</b><br/> 2. If current status  is <b>'Shipped - Not Invoiced'</b> and changing to <b>'Published'</b><br/>3. If current status is <b>'Invoiced'</b> and changing to <b>'Shipped - Not Invoiced'</b>.<br/>4. If current status is <b>'Corrected & Invoiced'</b> and changing to <b>'Shipped - Not Invoiced'</b>.<br/>5. If current status is <b>'Corrected & Invoiced'</b> and changing to <b>'Invoiced'</b>.",
                        modifiedDate: new Date(COMMON.getCurrentUTC()),
                        action: "U"
                    }
                ]
            };
            break;
        case 130:
            msgobj = {
                messageBuildNumber: 131,
                developer: "Shweta",
                message: [
                    {
                        messageKey: "PACKAGING_ALIAS_AVL_PART_UMID_RESTRICATED",
                        category: "MFG",
                        messageType: "Error",
                        messageCode: "MFG20130",
                        message: "UMID of Packaging Alias Part or AVL part of selected part can not be shipped.",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 131:
            msgobj = {
                messageBuildNumber: 132,
                developer: "Dharmishtha",
                message: [
                    {
                        messageCode: "RCV20243",
                        messageKey: "CHECK_RELEASE_QTY_DIFFER_LINE_VALIDATION",
                        messageType: "Information",
                        message: "You cannot merge the release(s) of different PO Line ID <b>{0}</b>. You are allowed to merge the release for the same PO Line(s).",
                        category: "RECEIVING",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "U"
                    }
                ]
            };
            break;
        case 132:
            msgobj = {
                messageBuildNumber: 133,
                developer: "Shweta",
                message: [
                    {
                        messageKey: "MISC_PACKINGSLIP_SO_ALREADY_EXISTS_CONFIRMATION",
                        category: "MFG",
                        messageType: "Confirmation",
                        messageCode: "MFG40043",
                        message: "You have selected MISC Customer Packing Slip and {0} or {1} already exists in Sales Order. Are you sure to continue? Press yes to continue.",
                        modifiedDate: new Date(COMMON.getCurrentUTC()),
                        action: "U"
                    }
                ]
            };
            break;
        case 133:
            msgobj = {
                messageBuildNumber: 134,
                developer: "Shweta",
                message: [
                    {
                        messageKey: "STATUS_CHANGE_REVISION_CONFIRMATION",
                        category: "GLOBAL",
                        messageType: "Confirmation",
                        messageCode: "GLB40042",
                        message: "{0} status will be <b>{1}</b>. Do you want to upgrage {0} Revision? Press Yes to Continue.",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 134:
            msgobj = {
                messageBuildNumber: 135,
                developer: "Shweta",
                message: [
                    {
                        messageKey: "PUBLISHED_TRANS_UPDATE_REVISION_CONFIRMATION",
                        category: "GLOBAL",
                        messageType: "Confirmation",
                        messageCode: "GLB40040",
                        message: "{0} status is <b>{1}</b>. Do you want to upgrade {0} Revision? Press Yes to Continue.",
                        modifiedDate: new Date(COMMON.getCurrentUTC()),
                        action: "U"
                    }
                ]
            };
            break;
        case 135:
            msgobj = {
                messageBuildNumber: 136,
                developer: "Shweta",
                message: [
                    {
                        messageKey: "GET_LATEST_PART_DESCRIPTION_CONFIRMATION",
                        category: "GLOBAL",
                        messageType: "Confirmation",
                        messageCode: "GLB40039",
                        message: "Existing description will be overwritten by Part Master description. Press yes to continue.",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "U"
                    }
                ]
            };
            break;
        case 136:
            msgobj = {
                messageBuildNumber: 137,
                developer: "Shweta",
                message: [
                    {
                        messageKey: "PUBLISHED_TRANS_UPDATE_REVISION_CONFIRMATION",
                        category: "GLOBAL",
                        messageType: "Confirmation",
                        messageCode: "GLB40040",
                        message: "Changes are made, Do you want to upgrade {0} version?",
                        modifiedDate: new Date(COMMON.getCurrentUTC()),
                        action: "U"
                    }
                ]
            };
            break;
        case 137:
            msgobj = {
                messageBuildNumber: 138,
                developer: "Shweta",
                message: [
                    {
                        messageKey: "PACKAGING_ALIAS_AVL_PART_UMID_RESTRICATED",
                        category: "MFG",
                        messageType: "Error",
                        messageCode: "MFG20130",
                        message: "You cannot ship Packaging Alias or AVL part UMID of selected MPN.",
                        modifiedDate: new Date(COMMON.getCurrentUTC()),
                        action: "U"
                    }
                ]
            };
            break;
        case 138:
            msgobj = {
                messageBuildNumber: 139,
                developer: "Shweta",
                message: [
                    {
                        messageKey: "PACKAGING_ALIAS_AVL_PART_UMID_RESTRICATED",
                        category: "MFG",
                        messageType: "Error",
                        messageCode: "MFG20130",
                        message: "UMID of Packaging Alias Part or AVL part of selected part can only be shipped, when its UOM is \"EACH\".",
                        modifiedDate: new Date(COMMON.getCurrentUTC()),
                        action: "U"
                    }
                ]
            };
            break;
        case 139:
            msgobj = {
                messageBuildNumber: 140,
                developer: "Ketan",
                message: [
                    {
                        messageKey: "CREDIT_MEMO_ALREADY_APPLIED_IN_INV_PAY",
                        category: "MFG",
                        messageType: "Error",
                        messageCode: "MFG20131",
                        message: "Credit memo <b>{0}</b> already applied. Please reset payment details.",
                        modifiedDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 140:
            msgobj = {
                messageBuildNumber: 141,
                developer: "Ketan",
                message: [
                    {
                        messageKey: "CUST_CREDIT_MEMO_INV_PAY_APPLIED_SUCCESS",
                        category: "MFG",
                        messageType: "Success",
                        messageCode: "MFG10015",
                        message: "Customer credit memo applied successfully.",
                        modifiedDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 141:
            msgobj = {
                messageBuildNumber: 142,
                developer: "Shweta",
                message: [
                    {
                        messageKey: "MISC_PACKINGSLIP_SO_ALREADY_EXISTS_CONFIRMATION",
                        category: "MFG",
                        messageType: "Confirmation",
                        messageCode: "MFG40043",
                        message: "You have selected MISC Customer Packing Slip and <b>{0}</b> already  exists in Sales Order. Are you sure to continue? Press yes to continue.",
                        modifiedDate: new Date(COMMON.getCurrentUTC()),
                        action: "U"
                    }
                ]
            };
            break;
        case 142:
            msgobj = {
                messageBuildNumber: 143,
                developer: "Ketan",
                message: [
                    {
                        messageKey: "NOT_ALLOWED_TO_CHANGE_CUST_CREDIT_MEMO_AS_PAID",
                        category: "MFG",
                        messageType: "Error",
                        messageCode: "MFG20132",
                        message: "You cannot update credit memo details as credit memo amount already applied in invoice payment.",
                        modifiedDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 143:
            msgobj = {
                messageBuildNumber: 144,
                developer: "Ketan",
                message: [
                    {
                        messageCode: "MFG20108",
                        messageKey: "INV_AMT_NOT_MORE_THAN_ACTUAL_PAY_AMT",
                        messageType: "Error",
                        message: "<b>Total applied amount of the selected invoice(s)</b> must be less than or equal to <b>{0} Amount</b>. Please update Invoice applied amount or re-select the Invoice accordingly.",
                        category: "MFG",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "U"
                    }
                ]
            };
            break;
        case 144:
            msgobj = {
                messageBuildNumber: 145,
                developer: "Shirish",
                message: [
                    {
                        messageCode: "RFQ50032",
                        messageKey: "WITHOUT_SAVING_ALERT_BODY_MESSAGE_PROGRAM_MAPPING",
                        messageType: "Information",
                        message: "Please save changes in prior to part program mapping.",
                        category: "RFQ",
                        modifiedDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 145:
            msgobj = {
                messageBuildNumber: 146,
                developer: "Shweta",
                message: [
                    {
                        messageKey: "MISC_PACKINGSLIP_SO_ALREADY_EXISTS_WARNING",
                        category: "MFG",
                        messageType: "Warning",
                        messageCode: "MFG30001",
                        message: "You have selected MISC {1} and <b>{0}</b> already exists in Sales Order.",
                        modifiedDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 146:
            msgobj = {
                messageBuildNumber: 147,
                developer: "Shweta",
                message: [
                    {
                        messageKey: "MISC_PACKINGSLIP_SO_ALREADY_EXISTS_CONFIRMATION",
                        category: "MFG",
                        messageType: "Confirmation",
                        messageCode: "MFG40043",
                        message: "You have selected MISC {1} and <b>{0}</b> already exists in Sales Order. Are you sure to continue? Press yes to continue.",
                        modifiedDate: new Date(COMMON.getCurrentUTC()),
                        action: "U"
                    }
                ]
            };
            break;
        case 147:
            msgobj = {
                messageBuildNumber: 148,
                developer: "Jay",
                message: [
                    {
                        messageKey: "PART_REQUIREMENT_CATEGORY_UPDATE_CONFIRMATION_MESSAGE",
                        category: "PARTS",
                        messageType: "Confirmation",
                        messageCode: "PRT40036",
                        message: "Are you sure to update selected Requirements & Comments category and status? Press Yes to Continue.",
                        modifiedDate: new Date(COMMON.getCurrentUTC()),
                        action: "U"
                    }
                ]
            };
            break;
        case 148:
            msgobj = {
                messageBuildNumber: 149,
                developer: "Jay",
                message: [
                    {
                        messageKey: "PO_ALREADY_CANCELED",
                        category: "RECEIVING",
                        messageType: "Confirmation",
                        messageCode: "RCV40084",
                        message: "PO# <b>{0}</b> is already canceled and parts from the canceled PO will be received as Rejected Parts. Are you sure you want to proceed to create Material Receipt?",
                        modifiedDate: new Date(COMMON.getCurrentUTC()),
                        action: "U"
                    }
                ]
            };
            break;
        case 149:
            msgobj = {
                messageBuildNumber: 150,
                developer: "Jay",
                message: [
                    {
                        messageKey: "UNCHECK_CANCELLATION_CONFIRMED_BY_SUPPLIER",
                        category: "RECEIVING",
                        messageType: "Warning",
                        messageCode: "RCV30021",
                        message: "Prior to UNDO CANCELLATION, please uncheck option <b>Cancellation Confirmed by Supplier</b>",
                        modifiedDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 150:
            msgobj = {
                messageBuildNumber: 151,
                developer: "Champak",
                message: [
                    {
                        messageKey: "TOTAL_SO_POQTY_SHIPQTYVALIDATION",
                        category: "MFG",
                        messageType: "Error",
                        messageCode: "MFG20133",
                        message: "Total <b>Release Qty From SO</b> should be equal to the <b>PO Qty</b>.",
                        modifiedDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 151:
            msgobj = {
                messageBuildNumber: 152,
                developer: "Champak",
                message: [
                    {
                        messageKey: "SO_RELEASE_LINE_QTY_ERROR_VALIDATION",
                        category: "MFG",
                        messageType: "Error",
                        messageCode: "MFG20134",
                        message: "<b>{0}</b> Qty already shipped in the customer packing slip(s), To change <b>Qty</b>, Please update <b>Ship Qty</b> in the customer packing slip(s).",
                        modifiedDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 152:
            msgobj = {
                messageBuildNumber: 153,
                developer: "Champak",
                message: [
                    {
                        messageKey: "SO_STATUS_CHANGE_REVISION_CONFIRMATION",
                        category: "MFG",
                        messageType: "Confirmation",
                        messageCode: "MFG00044",
                        message: "Sales Order already published, do you want to upgrade SO Version?",
                        modifiedDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 153:
            msgobj = {
                messageBuildNumber: 154,
                developer: "Champak",
                message: [
                    {
                        messageKey: "POQTY_RELEASELINEQTY_MISMATCH_INFORMATION",
                        category: "MFG",
                        messageType: "Error",
                        messageCode: "MFG20137",
                        message: "<b>{0}</b> cannot be more than <b>{1}</b>.",
                        modifiedDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 154:
            msgobj = {
                messageBuildNumber: 155,
                developer: "Champak",
                message: [
                    {
                        messageKey: "PO_QTY_RELEASE_QTY_NOT_MATCH_CONFIRMATION",
                        category: "MFG",
                        messageType: "Confirmation",
                        messageCode: "MFG40045",
                        message: "You are updating PO Qty from <b>{0}</b> to <b>{1}</b>, Last release line will be removed in case release line qty not shipped. Are you sure to continue?",
                        modifiedDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 155:
            msgobj = {
                messageBuildNumber: 156,
                developer: "Champak",
                message: [
                    {
                        messageKey: "DATE_COMPARE_VALIDATION",
                        category: "GLOBAL",
                        messageType: "Error",
                        messageCode: "GLB20062",
                        message: "{0} cannot be less than {1}.",
                        modifiedDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 156:
            msgobj = {
                messageBuildNumber: 157,
                developer: "Jay",
                message: [
                    {
                        messageKey: "PO_IS_ALREADY_CANCELED",
                        category: "RECEIVING",
                        messageType: "Warning",
                        messageCode: "RCV30022",
                        message: "PO# <b>{0}</b> is already canceled",
                        modifiedDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 157:
            msgobj = {
                messageBuildNumber: 158,
                developer: "Jay",
                message: [
                    {
                        messageKey: "PO_ALREADY_REVERTED",
                        category: "RECEIVING",
                        messageType: "Warning",
                        messageCode: "RCV30023",
                        message: "Cancellation already reverted for PO# <b>{0}</b>",
                        modifiedDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 158:
            msgobj = {
                messageBuildNumber: 159,
                developer: "Champak",
                message: [
                    {
                        messageKey: "SO_STATUS_CHANGE_REVISION_CONFIRMATION",
                        category: "MFG",
                        messageType: "Confirmation",
                        messageCode: "MFG00044",
                        message: "Sales Order changes are made, do you want to upgrade SO Version?",
                        modifiedDate: new Date(COMMON.getCurrentUTC()),
                        action: "U"
                    }
                ]
            };
            break;
        case 159:
            msgobj = {
                messageBuildNumber: 160,
                developer: "Charmi",
                message: [
                    {
                        messageCode: "RCV40035",
                        messageKey: "TRANSFER_INTO_SAME_BIN",
                        messageType: "Confirmation",
                        message: "Are you sure you want to transfer into same bin <b>{0}</b>?",
                        category: "RECEIVING",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 160:
            msgobj = {
                messageBuildNumber: 161,
                developer: "Champak",
                message: [
                    {
                        messageCode: "MFG40046",
                        messageKey: "SO_SAMEPART_CONFIRMATION_VALIDATION",
                        messageType: "Confirmation",
                        message: "Assy ID/PID <b>{0}</b> already added on SO Line# <b>{1}</b> with same Price and Qty. Are you sure to continue? Press Yes to Continue.",
                        category: "MFG",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 161:
            msgobj = {
                messageBuildNumber: 162,
                developer: "Champak",
                message: [
                    {
                        messageCode: "MFG40047",
                        messageKey: "SO_SAMEPART_CONFIRMATION_VALIDATION",
                        messageType: "Confirmation",
                        message: "Assy ID/PID <b>{0}</b> already added on SO Line# <b>{1}</b> with same Price and Qty. Are you sure to continue? Press Yes to Continue.",
                        category: "MFG",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "U"
                    }
                ]
            };
            break;
        case 162:
            msgobj = {
                messageBuildNumber: 163,
                developer: "Heena",
                message: [
                    {
                        messageCode: "MFG20143",
                        messageKey: "PAY_AMT_NOT_MORE_THAN_AGREEED_REF_AMT",
                        messageType: "Error",
                        message: "<b>Refund amount ${0}</b> must be less than or equal to <b>Remaning Agreed Refund amount ${1}</b>.",
                        category: "MFG",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "U"
                    }
                ]
            };
            break;
        case 163:
            msgobj = {
                messageBuildNumber: 164,
                developer: "Ashish",
                message: [
                    {
                        messageKey: "SUPPLIER_INVOICE_LINE_DETAILS_RESET_ON_DELETE_CONFIRMTION",
                        category: "RECEIVING",
                        messageType: "Confirmation",
                        messageCode: "RCV40090",
                        message: "You will lose all unsaved changes for Invoice Line Detail.<br/> Are you sure you want to proceed with delete?",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 164:
            msgobj = {
                messageBuildNumber: 165,
                developer: "Heena",
                message: [
                    {
                        messageCode: "MFG20149",
                        messageKey: "NO_CUST_PAY_CM_MARKED_REFUND",
                        messageType: "Error",
                        message: "No customer {0} marked for refund yet.",
                        category: "MFG",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 165:
            msgobj = {
                messageBuildNumber: 166,
                developer: "Ketan",
                message: [
                    {
                        messageCode: "MFG20147",
                        messageKey: "AGREED_REFUND_AMT_NOT_MORE_THAN_ACTUAL_PAY_AMT",
                        messageType: "Error",
                        message: "Agreed refund amount ${0} can not more than actual payment amount ${1}.",
                        category: "MFG",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 166:
            msgobj = {
                messageBuildNumber: 167,
                developer: "Ketan",
                message: [
                    {
                        messageCode: "MFG20148",
                        messageKey: "AGREED_REFUND_NOT_LESS_THAN_TOT_REFUNDED_AMT",
                        messageType: "Error",
                        message: "Already refunded amount is ${0}. So Agreed refund amount ${1} can not less than already refunded amount ${0}.",
                        category: "MFG",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 167:
            msgobj = {
                messageBuildNumber: 168,
                developer: "Heena",
                message: [
                    {
                        messageCode: "MFG40057",
                        messageKey: "STOCK_ADJUSTMENT_NOT_MORE_THAN_AVAILABLE_QTY",
                        messageType: "Confirmation",
                        message: "Stock Adjustment Qty is more than Available Qty for WO#: {0}, Are you sure, do you want to continue?",
                        category: "MFG",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 168:
            msgobj = {
                messageBuildNumber: 169,
                developer: "Ashish",
                message: [
                    {
                        messageKey: "RMA_CREATION_CONFIRMATION_FOR_NON_REJECTED_LINES",
                        category: "RECEIVING",
                        messageType: "Confirmation",
                        messageCode: "RCV40094",
                        message: "Received Status Packing slip line is  <b>{0}</b>, are you sure you want to continue?",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 169:
            msgobj = {
                messageBuildNumber: 170,
                developer: "Ashish",
                message: [
                    {
                        messageKey: "RECEIVED_STATUS_NOT_SET_AT_ADD_TIME",
                        category: "RECEIVING",
                        messageType: "Error",
                        messageCode: "RCV20193",
                        message: "You cannot change the <b>Received Decision</b> to <b>Accepted</b> or <b>Accept With Deviation</b> or <b>Rejected</b> as this part requires checking <b>Purchase Inspection Requirement(s)</b> by clicking on <b>Add</b> button. So please check that first then change the <b>Received Decision</b>.",
                        modifiedDate: new Date(COMMON.getCurrentUTC()),
                        action: "U"
                    }
                ]
            };
            break;
        case 170:
            msgobj = {
                messageBuildNumber: 171,
                developer: "Ashish",
                message: [
                    {
                        messageKey: "SUPPLIER_RMA_NUMNER_EXIST_CONFIRMATION_TO_UPDATE_OR_CREATE_NEW",
                        category: "RECEIVING",
                        messageType: "Confirmation",
                        messageCode: "RCV40092",
                        message: "RMA# <b>{0}</b> already exists for supplier <b>{1}</b> as below.",
                        modifiedDate: new Date(COMMON.getCurrentUTC()),
                        action: "U"
                    }
                ]
            };
            break;
        case 171:
            msgobj = {
                messageBuildNumber: 172,
                developer: "Ashish",
                message: [
                    {
                        messageKey: "CONFIRM_TO_SELECT_FROM_PO",
                        category: "RECEIVING",
                        messageType: "Confirmation",
                        messageCode: "RCV40089",
                        message: "Save or Reset data prior to pressing <b>SELECT FROM PO</b>",
                        modifiedDate: new Date(COMMON.getCurrentUTC()),
                        action: "U"
                    }
                ]
            };
            break;
        case 172:
            msgobj = {
                messageBuildNumber: 173,
                developer: "Charmi",
                message: [{
                    messageCode: "RCV50017",
                    messageKey: "SHELF_LIFE_UPON_MOUNTING_GROUP",
                    messageType: "Information",
                    category: "RECEIVING",
                    deletedDate: new Date(COMMON.getCurrentUTC()),
                    action: "D"
                }]
            };
            break;
        case 173:
            msgobj = {
                messageBuildNumber: 174,
                developer: "Charmi",
                message: [
                    {
                        messageKey: "CPN_NOT_ALLOW",
                        category: "RECEIVING",
                        messageType: "Error",
                        messageCode: "RCV20079",
                        message: "Scanned <b>{0}</b> is CPN. So, It is not allowed to scan in the <b>{1}</b> category.<br>Please select the <b>{2}</b> category to scan CPN part#.",
                        modifiedDate: new Date(COMMON.getCurrentUTC()),
                        action: "U"
                    }
                ]
            };
            break;
        case 174:
            msgobj = {
                messageBuildNumber: 175,
                developer: "Charmi",
                message: [
                    {
                        messageKey: "NOT_IN_BOM",
                        category: "RECEIVING",
                        messageType: "Error",
                        messageCode: "RCV20075",
                        message: "<b>{0}</b> received against PO# <b>{1}</b>.<br /><br />A. Press <b>SAME PO LINE ID</b> to receive material for selected line from below<br />B. Press <b>DIFFERENT PO LINE ID</b> to receive material in new line<br /><b>{0}</b> does not contain in selected Kit <b>{1}</b>. Please scan/select correct <b>{0}</b>.",
                        modifiedDate: new Date(COMMON.getCurrentUTC()),
                        action: "U"
                    }
                ]
            };
            break;
        case 175:
            msgobj = {
                messageBuildNumber: 176,
                developer: "Charmi",
                message: [
                    {
                        messageKey: "SO_CANCELED_NOT_ALLOW_TO_ALLOCATE_KIT",
                        category: "RECEIVING",
                        messageType: "Error",
                        messageCode: "RCV20178",
                        message: "This sales order <b>{0}</b> is canceled so you cannot allocate any inventory in this kit.",
                        modifiedDate: new Date(COMMON.getCurrentUTC()),
                        action: "U"
                    }
                ]
            };
            break;
        case 176:
            msgobj = {
                messageBuildNumber: 177,
                developer: "Charmi",
                message: [
                    {
                        messageKey: "PART_EXPIRE",
                        category: "RECEIVING",
                        messageType: "Error",
                        messageCode: "RCV20071",
                        message: "Material expiry date crossed shelf life date limit. System will not accept this material. Please contact to superior.",
                        modifiedDate: new Date(COMMON.getCurrentUTC()),
                        action: "U"
                    }
                ]
            };
            break;
        case 177:
            msgobj = {
                messageBuildNumber: 178,
                developer: "Charmi",
                message: [
                    {
                        messageKey: "SHELF_LIFE_DAYS_FOR_MOUNTING_GROUP_CHEMICAL_CONFIRMATION",
                        category: "RECEIVING",
                        messageType: "Error",
                        messageCode: "RCV40093",
                        message: "Shelf Life details are not added for part <b>{0}</b> in part details, Press Continue to redirect on Part Master detail.",
                        modifiedDate: new Date(COMMON.getCurrentUTC()),
                        action: "U"
                    }
                ]
            };
            break;
        case 178:
            msgobj = {
                messageBuildNumber: 179,
                developer: "Charmi",
                message: [
                    {
                        messageCode: "RCV20288",
                        messageKey: "NOT_IN_KIT",
                        messageType: "Error",
                        message: "Existing Assembly Stock for WO# <b>{0}</b> does not contain in selected Kit <b>{1}</b>. Please select correct Kit.",
                        category: "RECEIVING",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 179:
            msgobj = {
                messageBuildNumber: 180,
                developer: "Ashish",
                message: [
                    {
                        messageKey: "SUPPLIER_CM_DM_ALREADY_REFUNDED",
                        category: "RECEIVING",
                        messageType: "Error",
                        messageCode: "RCV20290",
                        message: "You cannot add a refund for <b>{0}</b> <b>{1}</b> as it is fully refunded.",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 180:
            msgobj = {
                messageBuildNumber: 181,
                developer: "Ashish",
                message: [
                    {
                        messageKey: "SUPPLIER_REFUND_AMOUNT_REMOVE_CONFIRMATION",
                        category: "RECEIVING",
                        messageType: "Confirmation",
                        messageCode: "RCV40095",
                        message: "Agreed Refund AMT ($) data will be lost on unchecking the checkbox. Press Yes to Continue.",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 181:
            msgobj = {
                messageBuildNumber: 182,
                developer: "Bhavik",
                message: [
                    {
                        messageKey: "RELOAD_PAGE_ALERT_ON_OVERIDE_USER",
                        category: "MASTER",
                        messageType: "Information",
                        messageCode: "MST50037",
                        message: "You are logged in as <b>{0}</b>, please reload the page.",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 182:
            msgobj = {
                messageBuildNumber: 183,
                developer: "Ketan",
                message: [
                    {
                        messageKey: "PAYMENT_NUM_REQUIRED_TO_PRINT_REFUND_REPORT",
                        category: "MFG",
                        messageType: "Information",
                        messageCode: "MFG50062",
                        message: "Payment# or Check# required to print refund check/remittance.",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 183:
            msgobj = {
                messageBuildNumber: 184,
                developer: "Ketan",
                message: [
                    {
                        messageKey: "CUST_REFUND_PMT_DUPLICATE_CONFM",
                        category: "MFG",
                        messageType: "Confirmation",
                        messageCode: "MFG40058",
                        message: "Payment# or Check# {0} already used in below transaction. Are you sure want to continue? Press Yes to Continue.",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 184:
            msgobj = {
                messageBuildNumber: 185,
                developer: "Ketan",
                message: [
                    {
                        messageKey: "REFUND_STATUS_CANNOT_CHANGED_TO_DRAFT_PUBLISHED",
                        category: "MFG",
                        messageType: "Error",
                        messageCode: "MFG20154",
                        message: "Action 'Change Status' not permitted for one of following reasons.<br/>1. If current status  is <b>'Ready to Print Check'</b> and changing to <b>'Draft/Published'</b><br/> 2. If current status  is <b>'Refunded'</b> and changing to <b>'Draft/Published/Ready to Print Check'</b><br/>",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 185:
            msgobj = {
                messageBuildNumber: 186,
                developer: "Ketan",
                message: [
                    {
                        messageKey: "REFUNDED_STATUS_REQUIRED_MARK_AS_PAID_IN_CUST_REFUND",
                        category: "MFG",
                        messageType: "Error",
                        messageCode: "MFG20155",
                        message: "Please first set current transaction <b>Mark As Paid</b>. After that you can change status from <b>{0}</b> to <b>Refunded</b>.",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 186:
            msgobj = {
                messageBuildNumber: 187,
                developer: "Ketan",
                message: [
                    {
                        messageCode: "MFG20148",
                        messageKey: "AGREED_REFUND_NOT_LESS_THAN_TOT_REFUNDED_AMT",
                        messageType: "Error",
                        message: "Already refunded amount is ${0}. So Agreed refund amount ${1} cannot less than already refunded amount ${0}.",
                        category: "MFG",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "U"
                    }
                ]
            };
            break;
        case 187:
            msgobj = {
                messageBuildNumber: 188,
                developer: "Champak",
                message: [
                    {
                        messageCode: "MFG20156",
                        messageKey: "BLANKET_PO_QTY_VALIDATION",
                        messageType: "Error",
                        message: "<b>{0}</b> cannot be greater then <b>{1}</b>.",
                        category: "MFG",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 188:
            msgobj = {
                messageBuildNumber: 189,
                developer: "Shirish",
                message: [
                    {
                        messageCode: "RFQ50041",
                        messageKey: "SUGGESTED_PARTS_ALREADY_AVAILABLE",
                        messageType: "Information",
                        message: "Suggested {0} part is already available in {1}.",
                        category: "RFQ",
                        modifiedDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 189:
            msgobj = {
                messageBuildNumber: 190,
                developer: "Shirish",
                message: [
                    {
                        messageCode: "RFQ40031",
                        messageKey: "MULTI_BOM_ACTIVITY_STOP_FROM_PART_MASTER_MESSAGE",
                        messageType: "Confirmation",
                        message: "BOM Activity will stop for following assemblies. Are you sure you want to continue?<br/>{0}",
                        category: "RFQ",
                        modifiedDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 190:
            msgobj = {
                messageBuildNumber: 191,
                developer: "Shirish",
                message: [
                    {
                        messageCode: "RFQ40003",
                        messageKey: "BOM_STOP_BY_SA_FROM_RFQ_LIST_MESSAGE",
                        messageType: "Confirmation",
                        message: "Are you sure you want to stop the BOM activity of User <b>{0}</b> for following assembly? <br/><b>{0}</b> User active session unsaved work will autosave if any. Press yes to continue.<br/>{1}",
                        category: "RFQ",
                        modifiedDate: new Date(COMMON.getCurrentUTC()),
                        action: "U"
                    }
                ]
            };
            break;
        case 191:
            msgobj = {
                messageBuildNumber: 192,
                developer: "Shirish",
                message: [
                    {
                        messageCode: "RFQ40016",
                        messageKey: "COSTING_STOP_FROM_RFQ_LIST_MESSAGE",
                        messageType: "Confirmation",
                        message: "Costing activity will stop for following assembly. Are you sure want to continue?<br/>{0}",
                        category: "RFQ",
                        modifiedDate: new Date(COMMON.getCurrentUTC()),
                        action: "U"
                    }
                ]
            };
            break;
        case 192:
            msgobj = {
                messageBuildNumber: 193,
                developer: "Shirish",
                message: [
                    {
                        messageCode: "RFQ40017",
                        messageKey: "COSTING_STOP_BY_SA_FROM_RFQ_LIST_MESSAGE",
                        messageType: "Confirmation",
                        message: "Are you sure you want to stop the costing activity of User <b>{0}</b> for following assembly? <br/><b>{0}</b> User active session unsaved work will autosave if any. Press yes to continue.<br/>{1}",
                        category: "RFQ",
                        modifiedDate: new Date(COMMON.getCurrentUTC()),
                        action: "U"
                    }
                ]
            };
            break;
        case 193:
            msgobj = {
                messageBuildNumber: 194,
                developer: "Shirish",
                message: [
                    {
                        messageCode: "RFQ50038",
                        messageKey: "BOM_PART_DETAILS_MODIFIED",
                        messageType: "Information",
                        message: "Following Part is updated in Part Master.<br/>{0}",
                        category: "RFQ",
                        modifiedDate: new Date(COMMON.getCurrentUTC()),
                        action: "U"
                    }
                ]
            };
            break;
        case 194:
            msgobj = {
                messageBuildNumber: 195,
                developer: "Shirish",
                message: [
                    {
                        messageCode: "RFQ40002",
                        messageKey: "BOM_STOP_FROM_RFQ_LIST_MESSAGE",
                        messageType: "Confirmation",
                        message: "BOM activity will stop for following assembly. Are you sure want to continue?<br/>{0}",
                        category: "RFQ",
                        modifiedDate: new Date(COMMON.getCurrentUTC()),
                        action: "U"
                    }
                ]
            };
            break;
        case 195:
            msgobj = {
                messageBuildNumber: 196,
                developer: "Shirish",
                message: [
                    {
                        messageCode: "PRT20033",
                        messageKey: "PART_UPDATE_VALIDATION_DUE_TO_BOM_ACTIVITY_STARTED",
                        messageType: "Error",
                        message: "Part is not allowed to update as BOM activity is going on for the following assemblies. Please stop the BOM activity first then try again.",
                        category: "PARTS",
                        modifiedDate: new Date(COMMON.getCurrentUTC()),
                        action: "U"
                    }
                ]
            };
            break;
        case 196:
            msgobj = {
                messageBuildNumber: 197,
                developer: "Bhavik",
                message: [
                    {
                        messageKey: "RELOAD_PAGE_ALERT_ON_OVERIDE_USER",
                        category: "MASTER",
                        messageType: "Information",
                        messageCode: "MST50037",
                        message: "You are logged in as <b>{0}</b>, please press OK to reload the page.",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "U"
                    }
                ]
            };
            break;
        case 197:
            msgobj = {
                messageBuildNumber: 198,
                developer: "Jay",
                message: [
                    {
                        messageKey: "RESTRICT_TO_PUBLISH_SOME_LINE_IS_PENDING",
                        category: "RECEIVING",
                        messageType: "Error",
                        messageCode: "RCV20291",
                        message: "<b>Received Status</b> of some of the packing slip line(s) are <b>Pending</b>, please update them in prior to Publishing the packing slip",
                        modifiedDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 198:
            msgobj = {
                messageBuildNumber: 199,
                developer: "Charmi",
                message: [
                    {
                        messageCode: "RCV40096",
                        messageKey: "RELEASED_KIT_TBD_POKITQTY_VALIDATION",
                        messageType: "Confirmation",
                        message: "Kit# <b>{0}</b> is Fully Released, so the excess <b>PO/Kit qty</b> will be adjusted in the last kit release plan.",
                        category: "RECEIVING",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 199:
            msgobj = {
                messageBuildNumber: 200,
                developer: "Charmi",
                message: [
                    {
                        messageKey: "RE_CALCULATE_CHANGE_SALESORDER",
                        category: "RECEIVING",
                        messageType: "Information",
                        messageCode: "RCV50004",
                        message: "User <b>{0}</b> have made some changes in <b>Assy ID</b> or <b>PO/Kit/MRP Quantity</b> of Sales Order# <b>{1}</b> from sales order screen. Please do continue to apply changes in Kit Allocation.",
                        modifiedDate: new Date(COMMON.getCurrentUTC()),
                        action: "U"
                    }
                ]
            };
            break;
        case 200:
            msgobj = {
                messageBuildNumber: 201,
                developer: "Charmi",
                message: [
                    {
                        messageKey: "RE_CALCULATE_CHANGE_SALESORDER",
                        category: "RECEIVING",
                        messageType: "Information",
                        messageCode: "RCV50002",
                        message: "You have made some changes in <b>Sales Order</b> or <b>PO/Kit/MRP Quantity</b> of Sales Order# <b>{0}</b>. Please click on Recalculate button to apply changes in Kit Allocation.",
                        modifiedDate: new Date(COMMON.getCurrentUTC()),
                        action: "U"
                    }
                ]
            };
            break;
        case 201:
            msgobj = {
                messageBuildNumber: 202,
                developer: "Charmi",
                message: [
                    {
                        messageKey: "RE_CALCULATE_CHANGE_SALESORDER",
                        category: "RECEIVING",
                        messageType: "Information",
                        messageCode: "RCV50004",
                        message: "User <b>{0}</b> have made some changes in <b>Assy ID</b> or <b>PO/Kit/MRP Quantity</b> of Sales Order# <b>{1}</b> from sales order screen. Please do continue to apply changes in Kit Allocation.",
                        modifiedDate: new Date(COMMON.getCurrentUTC()),
                        action: "U"
                    }
                ]
            };
            break;
        case 202:
            msgobj = {
                messageBuildNumber: 203,
                developer: "Charmi",
                message: [
                    {
                        messageKey: "RE_CALCULATE_KITQTY",
                        category: "RECEIVING",
                        messageType: "Information",
                        messageCode: "RCV50002",
                        message: "You have made some changes in <b>Sales Order</b> or <b>PO/Kit/MRP Quantity</b> of Sales Order# <b>{0}</b>. Please click on Recalculate button to apply changes in Kit Allocation.",
                        modifiedDate: new Date(COMMON.getCurrentUTC()),
                        action: "U"
                    }
                ]
            };
            break;
        case 203:
            msgobj = {
                messageBuildNumber: 204,
                developer: 'Shweta',
                message: [{
                    messageCode: 'MFG20091',
                    messageKey: 'WO_SERIES_ALREADY_EXISTS',
                    messageType: 'Error',
                    message: 'WO#: <b>{0}</b> already exists for MPN | Assy ID: <b>{1} | {2}</b>. Please add different WO# for initial stock.',
                    category: 'MFG',
                    createdDate: new Date(COMMON.getCurrentUTC()),
                    action: 'U'
                }]
            };
            break;
        case 204:
            msgobj = {
                messageBuildNumber: 205,
                developer: 'Shweta',
                message: [{
                    messageCode: 'MFG20200',
                    messageKey: 'SO_PO_NOT_UPDATED_INITIAL_STOCK_CREATED',
                    messageType: 'Error',
                    message: '<b>{0}</b> can not be changed as Initial Stock already created for <b>{1}</b>.',
                    category: 'MFG',
                    createdDate: new Date(COMMON.getCurrentUTC()),
                    action: 'I'
                }]
            };
            break;
        case 205:
            msgobj = {
                messageBuildNumber: 206,
                developer: 'Shweta',
                message: [{
                    messageCode: 'MFG20200',
                    messageKey: 'SO_DETAIL_NOT_DELETED_INITIAL_STOCK_CREATED',
                    messageType: 'Error',
                    message: 'Selected detail can not be deleted as Initial Stock already created for <b>{0}</b>.',
                    category: 'MFG',
                    createdDate: new Date(COMMON.getCurrentUTC()),
                    action: 'I'
                }]
            };
            break;
        case 206:
            msgobj = {
                messageBuildNumber: 207,
                developer: "Shweta",
                message: [{
                    messageKey: "WO_SO_NOT_ALLOWED_INITIAL_STOCK_CREATED",
                    category: "MFG",
                    messageType: "Error",
                    messageCode: "MFG20203",
                    message: "Selected SO#: <b>{0} </b> can not be added to Work Order as initial stock  already  created for same sales order.",
                    createdDate: new Date(COMMON.getCurrentUTC()),
                    action: "I"
                }]
            };
            break;
        case 207:
            msgobj = {
                messageBuildNumber: 208,
                developer: "Shweta",
                message: [{
                    messageKey: "PART_PREPROGRAMMING_MAPPING_NOT_ADDED",
                    category: "MFG",
                    messageType: "Error",
                    messageCode: "MFG20206",
                    message: "Pre-programming mapping not added from bill of material level. Please first add all pre-programming mapping.",
                    createdDate: new Date(COMMON.getCurrentUTC()),
                    action: "I"
                }]
            };
            break;
        case 208:
            msgobj = {
                messageBuildNumber: 209,
                developer: "Shweta",
                message: [{
                    messageKey: "PART_IS_NOT_REQUIRE_PREPROGRAMMING_FROM_PART_MASTER",
                    category: "MFG",
                    messageType: "Error",
                    messageCode: "MFG20207",
                    message: "UMID part is not required programming part from part master level.",
                    createdDate: new Date(COMMON.getCurrentUTC()),
                    action: "I"
                }]
            };
            break;
        case 209:
            msgobj = {
                messageBuildNumber: 210,
                developer: "Shweta",
                message: [{
                    messageKey: "UMID_NOT_IN_KIT_FOR_WO_PREPROG",
                    category: "MFG",
                    messageType: "Error",
                    messageCode: "MFG20208",
                    message: "UMID not assigned in KIT.",
                    createdDate: new Date(COMMON.getCurrentUTC()),
                    action: "I"
                }]
            };
            break;
        case 210:
            msgobj = {
                messageBuildNumber: 211,
                developer: 'Shweta',
                message: [{
                    messageCode: 'MFG20201',
                    messageKey: 'SO_DETAIL_NOT_DELETED_INITIAL_STOCK_CREATED',
                    messageType: 'Error',
                    message: 'Selected detail can not be deleted as Initial Stock already created for <b>{0}</b>.',
                    category: 'MFG',
                    modifiedDate: new Date(COMMON.getCurrentUTC()),
                    action: 'U'
                }]
            };
            break;
        case 211:
            msgobj = {
                messageBuildNumber: 212,
                developer: "Shweta",
                message: [{
                    messageKey: "PART_PREPROGRAMMING_MAPPING_NOT_ADDED",
                    category: "MFG",
                    messageType: "Error",
                    messageCode: "MFG20206",
                    message: "Pre-programming mapping not added from bill of material level. Please first add all pre-programming mapping.",
                    createdDate: new Date(COMMON.getCurrentUTC()),
                    action: "U"
                }]
            };
            break;
        case 212:
            msgobj = {
                messageBuildNumber: 213,
                developer: "Shweta",
                message: [{
                    messageKey: "PART_IS_NOT_REQUIRE_PREPROGRAMMING_FROM_PART_MASTER",
                    category: "MFG",
                    messageType: "Error",
                    messageCode: "MFG20207",
                    message: "UMID part is not required programming part from part master level.",
                    createdDate: new Date(COMMON.getCurrentUTC()),
                    action: "U"
                }]
            };
            break;
        case 213:
            msgobj = {
                messageBuildNumber: 214,
                developer: "Shweta",
                message: [{
                    messageKey: "UMID_NOT_IN_KIT_FOR_WO_PREPROG",
                    category: "MFG",
                    messageType: "Error",
                    messageCode: "MFG20208",
                    message: "UMID not assigned in KIT.",
                    createdDate: new Date(COMMON.getCurrentUTC()),
                    action: "U"
                }]
            };
            break;
        case 214:
            msgobj = {
                messageBuildNumber: 215,
                developer: "Jay",
                message: [{
                    messageKey: "USER_STATUS_RESTRICT_PO_LINE_MANUAL_CLOSED",
                    category: "RECEIVING",
                    messageType: "Error",
                    messageCode: "RCV20306",
                    message: "You cannot change the status from <b>Published</b> to <b>Draft</b>. Because <b>PO#</b> {0} line working status is closed.",
                    createdDate: new Date(COMMON.getCurrentUTC()),
                    action: "I"
                }]
            };
            break;
        case 215:
            msgobj = {
                messageBuildNumber: 216,
                developer: "Ketan",
                message: [{
                    messageKey: "CUST_INV_PENDING_RECEIVE_AMT_FOR_LOCK",
                    category: "MFG",
                    messageType: "Error",
                    messageCode: "MFG20211",
                    message: "{0} customer invoice contain some <b>Open Balance (Payment not fully received)</b>. You can not lock.",
                    createdDate: new Date(COMMON.getCurrentUTC()),
                    action: "I"
                }]
            };
            break;
        case 216:
            msgobj = {
                messageBuildNumber: 217,
                developer: "Ketan",
                message: [{
                    messageKey: "TOT_CUST_WOFF_GREATER_THEN_ZERO",
                    category: "MFG",
                    messageType: "Error",
                    messageCode: "MFG20212",
                    message: "Total Write Off amount must be greater than $0. Please add write off amount.",
                    createdDate: new Date(COMMON.getCurrentUTC()),
                    action: "I"
                }]
            };
            break;
        case 217:
            msgobj = {
                messageBuildNumber: 218,
                developer: "Ketan",
                message: [{
                    messageKey: "CUST_INV_PAY_ITEM_MAX_ALLOWED_AMT",
                    category: "MFG",
                    messageType: "Error",
                    messageCode: "MFG20213",
                    message: "You have entered Invalid {0} amount ${1}. You cannot enter {0} amount more than <b>outstanding amount ${2}</b>.",
                    createdDate: new Date(COMMON.getCurrentUTC()),
                    action: "I"
                }]
            };
            break;
        case 218:
            msgobj = {
                messageBuildNumber: 219,
                developer: "Shirish",
                message: [
                    {
                        messageCode: "RFQ50013",
                        messageKey: "INVALID_ASSY_DETAIL",
                        messageType: "Information",
                        message: "In prior to change assembly you must have to fill up all valid detail of RFQ assembly.<br> Please fill up '{0}' valid detail.",
                        category: "RFQ",
                        modifiedDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 219:
            msgobj = {
                messageBuildNumber: 220,
                developer: "Shweta",
                message: [
                    {
                        messageCode: "MFG40070",
                        messageKey: "SO_PONUMBER_REPLACE_CONFIRM",
                        messageType: "Confirmation",
                        message: "Customer PO# <b>{0}</b> will be replaced by <b>{1}</b> for current SO# <b>{2}</b>. Press Yes to Continue.",
                        category: "MFG",
                        modifiedDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 220:
            msgobj = {
                messageBuildNumber: 221,
                developer: "Shweta",
                message: [
                    {
                        messageCode: "MFG40071",
                        messageKey: "SO_PONUMBER_REPLACE_CONFIRM_WITH_DETAIL",
                        messageType: "Confirmation",
                        message: "Customer PO# <b>{0}</b> will be replaced by <b>{1}</b> for  current SO# <b>{2}</b>. Press Yes to Continue.<br/>\
                                    <p>Following details will be copied from Original PO#</p> \
                                    <ul> \
                                    <li>Sales Commission To </li> \
                                    <li>Terms </li> \
                                    <li>Shipping Method </li> \
                                    <li>Carrier</li> \
                                    <li>Carrier Account#</li> \
                                    <li>FOB</li> \
                                    <li>Header Internal Notes</li> \
                                    <li>Header Shipping Comments</li> \
                                    <li>Bill To</li> \
                                    <li>Ship To</li> \
                                    <li>Mark For (Intermediate Ship To)</li> \
                                    </ul>",
                        category: "MFG",
                        modifiedDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 221:
            msgobj = {
                messageBuildNumber: 222,
                developer: "Charmi",
                message: [
                    {
                        messageKey: "SPQ_MORE_ALLOW_FOR_CT_CR",
                        category: "RECEIVING",
                        messageType: "Confirmation",
                        messageCode: "RCV40100",
                        message: "Entered count <b>{0}</b> is greater than UMID SPQ <b>{1}</b> of Part <b>{2}</b> <b>{3}</b>.<br /> Do you want to Continue or Change Count?",
                        modifiedDate: new Date(COMMON.getCurrentUTC()),
                        action: "U"
                    }
                ]
            };
            break;
        case 222:
            msgobj = {
                messageBuildNumber: 223,
                developer: "Charmi",
                message: [
                    {
                        messageKey: "FROM_AND_TO_BIN_UMID_CREATION_VALIDATION",
                        category: "RECEIVING",
                        messageType: "Error",
                        messageCode: "RCV20318",
                        message: "<b>To Location/Bin</b> and <b>From Bin</b> must be different, please scan different Bin.",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 223:
            msgobj = {
                messageBuildNumber: 224,
                developer: "Shweta",
                message: [
                    {
                        messageCode: "MFG40070",
                        messageKey: "SO_PONUMBER_REPLACE_CONFIRM",
                        messageType: "Confirmation",
                        message: "Customer PO#: <b>{0}</b> will be replaced by PO#: <b>{1}</b> for current SO# <b>{2}</b>. Press Yes to Continue.",
                        category: "MFG",
                        modifiedDate: new Date(COMMON.getCurrentUTC()),
                        action: "U"
                    }
                ]
            };
            break;
        case 224:
            msgobj = {
                messageBuildNumber: 225,
                developer: "Shweta",
                message: [
                    {
                        messageCode: "MFG40071",
                        messageKey: "SO_PONUMBER_REPLACE_CONFIRM_WITH_DETAIL",
                        messageType: "Confirmation",
                        message: "Customer PO#: <b>{0}</b> will be replaced by PO#: <b>{1}</b> for  current SO# <b>{2}</b>. Press Yes to Continue.<br/>\
                                    <p>Following details will be copied from Original PO#</p> \
                                    <ul> \
                                    <li>Sales Commission To </li> \
                                    <li>Terms </li> \
                                    <li>Shipping Method </li> \
                                    <li>Carrier</li> \
                                    <li>Carrier Account#</li> \
                                    <li>FOB</li> \
                                    <li>Header Internal Notes</li> \
                                    <li>Header Shipping Comments</li> \
                                    <li>Bill To</li> \
                                    <li>Ship To</li> \
                                    <li>Mark For (Intermediate Ship To)</li> \
                                    </ul>",
                        category: "MFG",
                        modifiedDate: new Date(COMMON.getCurrentUTC()),
                        action: "U"
                    }
                ]
            };
            break;
        case 225:
            msgobj = {
                messageBuildNumber: 226,
                developer: "Shweta",
                message: [
                    {
                        messageCode: "MFG40072",
                        messageKey: "PS_CREATION_FOR_RMA_PO_CONFIRMATION",
                        messageType: "Confirmation",
                        message: "You have selected RMA PO#: <b>{0}</b>. Are you sure to create Packing slip? Press Yes to continue.",
                        category: "MFG",
                        modifiedDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 226:
            msgobj = {
                messageBuildNumber: 227,
                developer: "Shweta",
                message: [
                    {
                        messageCode: "MFG20218",
                        messageKey: "WO_OP_REFDES_RANGE_NOT_ALLOWED",
                        messageType: "Error",
                        message: "Invalid RefDes: <b>{0}</b>! Range not allowed for manual entry.",
                        category: "MFG",
                        modifiedDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 227:
            msgobj = {
                messageBuildNumber: 228,
                developer: "Shweta",
                message: [
                    {
                        messageCode: "MFG20121",
                        messageKey: "SALESORDER_UPDATE_RESTRICTED_AFTER_PACKINGSLIP",
                        messageType: "Error",
                        message: "Changing {1} from <b>Published</b> to <b>Draft</b> is restricted due to one of reason below for selected SO# <b>{0}</b> : <ul> <li>Customer Packing Slip is created.</li><li>Work order is created.</li><li>Kit is released.</li></ul>",
                        category: "MFG",
                        modifiedDate: new Date(COMMON.getCurrentUTC()),
                        action: "U"
                    }
                ]
            };
            break;
        case 228:
            msgobj = {
                messageBuildNumber: 229,
                developer: "Shweta",
                message: [
                    {
                        messageCode: "MFG20210",
                        messageKey: "UMID_STRICTY_LIMIT_REFDES_ONLY",
                        messageType: "Error",
                        message: "Entered / Selected RefDes : {0} <br/><br/> Operation configured as 'Allow only RefDes from this list when using UMID' with following RefDes: <br/>{1}",
                        category: "MFG",
                        modifiedDate: new Date(COMMON.getCurrentUTC()),
                        action: "U"
                    }
                ]
            };
            break;
        case 229:
            msgobj = {
                messageBuildNumber: 230,
                developer: "Shweta",
                message: [
                    {
                        messageCode: "MFG20224",
                        messageKey: "SCAN_MISSING_WRONG_WO_STATUS",
                        messageType: "Error",
                        message: "You cannot scan missing material as WO# {0} status is not '{1}'.",
                        category: "MFG",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 230:
            msgobj = {
                messageBuildNumber: 231,
                developer: "Ketan",
                message: [
                    {
                        messageCode: "MFG20219",
                        messageKey: "VOID_TRANS_NOT_ALLOWED_AS_AMOUNT_REFUNDED",
                        messageType: "Error",
                        message: "Refund already initiated against {0}. You can not {1} {2} transaction.",
                        category: "MFG",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 231:
            msgobj = {
                messageBuildNumber: 232,
                developer: "Champak",
                message: [
                    {
                        messageCode: "RCV40102",
                        messageKey: "RECV_UOM_DETAIL_REMOVE_CONFIRMATION",
                        messageType: "Confirmation",
                        message: "On change to Formula, The added deviation values will be removed. Press Yes to Continue.",
                        category: "RECEIVING",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 232:
            msgobj = {
                messageBuildNumber: 233,
                developer: "Bhavik",
                message: [
                    {
                        messageCode: "GLB40004",
                        messageKey: "CHANGE_EMP_MESSAGE",
                        messageType: "Confirmation",
                        message: "Credentials are changed! <br /><b>{0}</b> user will be logged out from all other devices except current. Are you sure you want to Continue? <br />Press <b>LOGOUT & CHANGE CREDENTIAL</b> to change current Credentials. <br />Press <b>KEEP OLD CREDENTIAL</b> to keep current Credentials.",
                        category: "GLOBAL",
                        modifiedDate: new Date(COMMON.getCurrentUTC()),
                        action: "U"
                    }
                ]
            };
            break;
        case 233:
            msgobj = {
                messageBuildNumber: 234,
                developer: "Champak",
                message: [
                    {
                        messageCode: "MFG20214",
                        messageKey: "PO_RELEASE_NUMBER_MISMATCH_ERROR",
                        messageType: "Error",
                        message: "Multiple PO Release#(s) are not permitted within same packing slip.<br/>All PO Release# must be <b>{0}</b> in this packing slip.",
                        category: "MFG",
                        modifiedDate: new Date(COMMON.getCurrentUTC()),
                        action: "U"
                    }
                ]
            };
            break;
        case 234:
            msgobj = {
                messageBuildNumber: 235,
                developer: "Shweta",
                message: [
                    {
                        messageCode: "MFG40076",
                        messageKey: "UPGRAGE_MULTI_SO_VERSION_CONFIRMATION",
                        messageType: "Confirmation",
                        message: "Changes are made in Following SO#. Do you want to  upgrade version from <b>Old Ver.</b> to <b>New Ver.</b> ? {0} ",
                        category: "MFG",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 235:
            msgobj = {
                messageBuildNumber: 236,
                developer: "Champak",
                message: [
                    {
                        messageCode: "MFG20226",
                        messageKey: "LINKTOBPO_ALERT_NOT_MAP_ANYBPO",
                        messageType: "Error",
                        message: "You cannot set <b>Link To Blanket PO</b> option because PO Line#(s) <b>{0}</b> is not linked with Blanket PO.<br/> All PO Line#(s) must be linked with Blanket PO.",
                        category: "MFG",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 236:
            msgobj = {
                messageBuildNumber: 237,
                developer: "Champak",
                message: [
                    {
                        messageCode: "MFG20227",
                        messageKey: "BLANKETPO_NOT_MAPPED_WITH_FPO",
                        messageType: "Error",
                        message: "PO Line# <b>{0}</b> must be required to link with Blanket PO because <b>Link To Blanket PO</b> option selected in this PO# <b>{1}</b>.",
                        category: "MFG",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 237:
            msgobj = {
                messageBuildNumber: 238,
                developer: "Champak",
                message: [
                    {
                        messageCode: "MFG20228",
                        messageKey: "LINKTOBPO_ALERT_NOT_REMOVE",
                        messageType: "Error",
                        message: "You cannot unlink PO# <b>{0}</b> because <b>Link To Blanket PO</b> option selected in PO# <b>{0}</b>.",
                        category: "MFG",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 238:
            msgobj = {
                messageBuildNumber: 239,
                developer: "Champak",
                message: [
                    {
                        messageCode: "MFG20229",
                        messageKey: "CUSTOMER_PACKINGSLIP_SHIP_BPO",
                        messageType: "Error",
                        message: "You cannot unlink PO# <b>{0}</b> because PO# <b>{0}</b> already used in <b>{1}</b> transaction.",
                        category: "MFG",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 239:
            msgobj = {
                messageBuildNumber: 240,
                developer: "Champak",
                message: [
                    {
                        messageCode: "MFG40075",
                        messageKey: "UNLINK_REMOVE_CONFIRMATION_ALERT",
                        messageType: "Confirmation",
                        message: "Are you sure to unlink PO# <b>{0}</b> from Blanket PO# <b>{1}</b>. Press yes to Continue.",
                        category: "MFG",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 240:
            msgobj = {
                messageBuildNumber: 241,
                developer: "Champak",
                message: [
                    {
                        messageCode: "MFG20230",
                        messageKey: "FPO_BPO_MAPPING_QTY_MISMATCH",
                        messageType: "Error",
                        message: "Future PO(s) cannot linked with Blanket PO as selected Future PO(s) Qty <b>{0}</b> more than Blanket PO Qty <b>{1}</b>.",
                        category: "MFG",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 241:
            msgobj = {
                messageBuildNumber: 242,
                developer: "Champak",
                message: [
                    {
                        messageCode: "MFG20222",
                        messageKey: "BLANKET_PO_FUTURE_PO_OPTION_SELECT_ALERT",
                        messageType: "Error",
                        message: "<b>Link Future PO(s) to This Blanket PO</b> option cannot be changed because release line is present in this PO# <b>{0}</b>.",
                        category: "MFG",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "U"
                    }
                ]
            };
            break;
        case 242:
            msgobj = {
                messageBuildNumber: 243,
                developer: "Shweta",
                message: [
                    {
                        messageCode: "MFG20153",
                        messageKey: "TOT_AMT_NOT_ALLOWED_ZERO_FOR_CUST_CREDIT_MEMO",
                        messageType: "Error",
                        message: "To publish credit memo, total credit memo amount must be more than $0.",
                        category: "MFG",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 243:
            msgobj = {
                messageBuildNumber: 244,
                developer: "Shweta",
                message: [
                    {
                        messageCode: "MFG20197",
                        messageKey: "EQUIPMENT_ONLINE_ERROR",
                        messageType: "Error",
                        message: "Before stoping current activity please make equipment {0} offline.",
                        category: "MFG",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 244:
            msgobj = {
                messageBuildNumber: 245,
                developer: "Bhavik",
                message: [
                    {
                        messageCode: "MST50038",
                        messageKey: "RELEASE_CURRENT_CONT_PERSON",
                        messageType: "Information",
                        message: "Release Contact person first in prior to uncheck require contact person.",
                        category: "MASTER",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 245:
            msgobj = {
                messageBuildNumber: 246,
                developer: "Champak",
                message: [
                    {
                        messageCode: "MST10071",
                        messageKey: "ADDRESS_REMOVED_AS_DEFAULT",
                        messageType: "Success",
                        message: "Default Address has been removed.",
                        category: "MASTER",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 246:
            msgobj = {
                messageBuildNumber: 247,
                developer: "Champak",
                message: [
                    {
                        messageCode: "GLB10024",
                        messageKey: "ITEM_REMOVE_AS_DEFAULT",
                        messageType: "Success",
                        message: "{0} has been removed as default.",
                        category: "GLOBAL",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 247:
            msgobj = {
                messageBuildNumber: 248,
                developer: "Champak",
                message: [
                    {
                        messageCode: "MST40039",
                        messageKey: "BILL_SHIP_ADDR_CHANGE_CONFIRM",
                        messageType: "Confirmation",
                        message: "Not recommended!!!<br/>Changes will be applied to all past(closed) and open transactions. Do you still want to continue?",
                        category: "MASTER",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "U"
                    }
                ]
            };
            break;
        case 248:
            msgobj = {
                messageBuildNumber: 249,
                developer: "Champak",
                message: [
                    {
                        messageCode: "RFQ40035",
                        messageKey: "PRICING_CONTINUE",
                        messageType: "Confirmation",
                        message: "No unpriced item quantity available do you want to start again?",
                        category: "RFQ",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 249:
            msgobj = {
                messageBuildNumber: 250,
                developer: "Champak",
                message: [
                    {
                        messageCode: "RFQ40036",
                        messageKey: "PRICING_SAVE",
                        messageType: "Confirmation",
                        message: "Do you want to save changes prior to closing this view?",
                        category: "RFQ",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 250:
            msgobj = {
                messageBuildNumber: 251,
                developer: "Champak",
                message: [
                    {
                        messageCode: "RFQ40037",
                        messageKey: "STOCK_UPDATE_CONFIRM",
                        messageType: "Confirmation",
                        message: "Do you want to update stock for external price? Press Yes to Continue.",
                        category: "RFQ",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 251:
            msgobj = {
                messageBuildNumber: 252,
                developer: "Champak",
                message: [
                    {
                        messageCode: "RFQ50049",
                        messageKey: "COPY_EXIST",
                        messageType: "Information",
                        message: "Price already modified for packaging {0}.",
                        category: "RFQ",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 252:
            msgobj = {
                messageBuildNumber: 253,
                developer: "Champak",
                message: [
                    {
                        messageCode: "RFQ50050",
                        messageKey: "PRICING_LINEITEM",
                        messageType: "Information",
                        message: "All items are priced.",
                        category: "RFQ",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 253:
            msgobj = {
                messageBuildNumber: 254,
                developer: "Champak",
                message: [
                    {
                        messageCode: "RFQ50051",
                        messageKey: "NOPARTSFORPRICE",
                        messageType: "Information",
                        message: "No parts for Pricing",
                        category: "RFQ",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 254:
            msgobj = {
                messageBuildNumber: 255,
                developer: "Champak",
                message: [
                    {
                        messageCode: "RFQ50052",
                        messageKey: "STOCK_NOT_UPDATE",
                        messageType: "Information",
                        message: "Pricing does not exists to update stock.",
                        category: "RFQ",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 255:
            msgobj = {
                messageBuildNumber: 256,
                developer: "Champak",
                message: [
                    {
                        messageCode: "RFQ40038",
                        messageKey: "MODIFY_PRICE",
                        messageType: "Confirmation",
                        message: "Do you want to modify price? Press Yes to Continue.",
                        category: "RFQ",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 256:
            msgobj = {
                messageBuildNumber: 257,
                developer: "Champak",
                message: [
                    {
                        messageCode: "RFQ40039",
                        messageKey: "PRICING_SELECT_ALL",
                        messageType: "Confirmation",
                        message: "Do you want to apply selected price for all quantity? Press Yes to Continue.",
                        category: "RFQ",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 257:
            msgobj = {
                messageBuildNumber: 258,
                developer: "Champak",
                message: [
                    {
                        messageCode: "RFQ40040",
                        messageKey: "PRICING_SELECT",
                        messageType: "Confirmation",
                        message: "Do you want to save pricing for selected line item?",
                        category: "RFQ",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 258:
            msgobj = {
                messageBuildNumber: 259,
                developer: "Champak",
                message: [
                    {
                        messageCode: "RFQ50053",
                        messageKey: "QTY_ALREADY_EXIST",
                        messageType: "Information",
                        message: "{0} quantity already exist.",
                        category: "RFQ",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 259:
            msgobj = {
                messageBuildNumber: 260,
                developer: "Champak",
                message: [
                    {
                        messageCode: "RFQ50054",
                        messageKey: "QTY_ALREADY_EXIST_WITH_LEADTIME",
                        messageType: "Information",
                        message: "{0} quantity already exist with this lead time.",
                        category: "RFQ",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 260:
            msgobj = {
                messageBuildNumber: 261,
                developer: "Shweta",
                message: [{
                    messageCode: "MFG40029",
                    messageKey: "CUSTOMER_SO_PACKING_SLIP_ADDRESS_SHIPPING_MISMATCH_CONFIRMATION",
                    messageType: "Confirmation",
                    message: "Following detail of Packing Slip Header is mismatched with Sales Order Header/SO Release Line. Press 'Apply' to continue with <b>Selected Shipping Details Manually</b>.<br/>Please select {0} from  Sales Order Header/SO Release Line/Packing Slip Header or else Select Shipping Details Manually, then press 'Apply' to save Packing Slip with selected details.",
                    category: "MFG",
                    modifiedDate: new Date(COMMON.getCurrentUTC()),
                    action: "U"
                }]
            };
            break;
        case 261:
            msgobj = {
                messageBuildNumber: 262,
                developer: "SHUBHAM",
                message: [
                    {
                        messageKey: "UPDATE_SINGLE_ATTRIBUTE_CONFRIMATION",
                        category: "PARTS",
                        messageType: "Confirmation",
                        messageCode: "PRT40040",
                        message: "Are you sure you want to copy {0} attribute from base part to all other parts?",
                        modifiedDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 262:
            msgobj = {
                messageBuildNumber: 263,
                developer: "SHUBHAM",
                message: [
                    {
                        messageKey: "CONFIRM_ON_CHNAGE_BASE_PART",
                        category: "PARTS",
                        messageType: "Confirmation",
                        messageCode: "PRT40041",
                        message: "Are you sure you want to change {0}  part as Base Part? Press yes to Continue.",
                        modifiedDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 263:
            msgobj = {
                messageBuildNumber: 264,
                developer: "SHUBHAM",
                message: [
                    {
                        messageKey: "ADD_ALTERNATE_PART_CPN_WITH_AVL_CONFIRMATION",
                        category: "MASTER",
                        messageType: "Confirmation",
                        messageCode: "MST40047",
                        message: "Are you sure you want to add {0} as CPN, this will also map {1} as an AVL? Press Yes to Continue.",
                        modifiedDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 264:
            msgobj = {
                messageBuildNumber: 265,
                developer: "SHUBHAM",
                message: [
                    {
                        messageKey: "ALREADY_MAPPED_AVL_ERROR",
                        category: "MASTER",
                        messageType: "Error",
                        messageCode: "MST20077",
                        message: "Selected AVL part is already mapped!",
                        modifiedDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 265:
            msgobj = {
                messageBuildNumber: 266,
                developer: "Jay",
                message: [
                    {
                        messageKey: "MARK_FOR_REFUND_VALIDATION_FOR_NOT_APPROVED_TO_PAY_STATUS",
                        category: "RECEIVING",
                        messageType: "Error",
                        messageCode: "RCV20270",
                        message: "<b>{0}</b> is already Marked for Refund, to save Credit memo details with Variance first remove the Mark For Refund details.",
                        modifiedDate: new Date(COMMON.getCurrentUTC()),
                        action: "U"
                    }
                ]
            };
            break;
        case 266:
            msgobj = {
                messageBuildNumber: 267,
                developer: "Charmi",
                message: [
                    {
                        messageCode: "RCV20328",
                        messageKey: "UMID_STOCK_NOT_EXITS",
                        messageType: "Error",
                        message: "Available Stock is <b>{0}</b>. You can not change more than <b>{1}</b>.",
                        category: "GLOBAL",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 267:
            msgobj = {
                messageBuildNumber: 268,
                developer: "Charmi",
                message: [
                    {
                        messageCode: "RCV20328",
                        messageKey: "UMID_STOCK_NOT_EXITS",
                        messageType: "Error",
                        category: "GLOBAL",
                        deletedDate: new Date(COMMON.getCurrentUTC()),
                        action: "D"
                    }
                ]
            };
            break;
        case 268:
            msgobj = {
                messageBuildNumber: 269,
                developer: "Charmi",
                message: [
                    {
                        messageCode: "RCV20328",
                        messageKey: "UMID_STOCK_NOT_EXITS",
                        messageType: "Error",
                        message: "Available Stock is <b>{0}</b>. You can not change more than <b>{1}</b>.",
                        category: "RECEIVING",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 269:
            msgobj = {
                messageBuildNumber: 270,
                developer: "Shweta",
                message: [{
                    messageCode: "MFG40029",
                    messageKey: "CUSTOMER_SO_PACKING_SLIP_ADDRESS_SHIPPING_MISMATCH_CONFIRMATION",
                    messageType: "Confirmation",
                    message: "Following detail(Shipping Address / Shipping Method / Carrier / Carrier Account#) of Packing Slip Header is mismatched with Sales Order Header/SO Release Line. Select correct detail or enter shipping detail manually and save to update packing slip header detail.",
                    category: "MFG",
                    modifiedDate: new Date(COMMON.getCurrentUTC()),
                    action: "U"
                }]
            };
            break;
        case 270:
            msgobj = {
                messageBuildNumber: 271,
                developer: "SHUBHAM",
                message: [
                    {
                        messageCode: "PRT20048",
                        messageKey: "SERIAL_NUMBER_ALREADY_IN_USE",
                        messageType: "Error",
                        message: "Serial# Configuration already used in work order!",
                        category: "PARTS",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 271:
            msgobj = {
                messageBuildNumber: 272,
                developer: "SHUBHAM",
                message: [
                    {
                        messageCode: "PRT40041",
                        messageKey: "DELETE_CONFIRM_CONFIGURE_SERIAL",
                        messageType: "Confirmation",
                        message: "Are you sure you want to remove <b>Serial# Configuration</b>? Press Yes to Continue.",
                        category: "PARTS",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 272:
            msgobj = {
                messageBuildNumber: 273,
                developer: "Bhavik",
                message: [
                    {
                        messageCode: "MST40048",
                        messageKey: "REMOVE_FROM_PRIMARY",
                        messageType: "Confirmation",
                        message: "<b>{0}</b> Contact Person will be removed from primary Contact Person. Press Yes to Continue.",
                        category: "MASTER",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 273:
            msgobj = {
                messageBuildNumber: 274,
                developer: "Bhavik",
                message: [
                    {
                        messageKey: "CONT_PERSON_UPDATE_CONFRIMATION",
                        messageCode: "MST40042",
                        category: "MASTER",
                        deletedDate: new Date(COMMON.getCurrentUTC()),
                        action: "D"
                    }
                ]
            };
            break;
        case 274:
            msgobj = {
                messageBuildNumber: 275,
                developer: "Jay",
                message: [
                    {
                        messageKey: "NOT_ALLOWED_TO_DELETE_PO_WITH_LINES",
                        messageCode: "RCV20329",
                        messageType: "Error",
                        message: "In prior to delete Purchase Order, Please delete all detail lines then try again.",
                        category: "RECEIVING",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 275:
            msgobj = {
                messageBuildNumber: 276,
                developer: "Charmi",
                message: [{
                    messageCode: "RCV20147",
                    messageKey: "SAME_FROM_TO_BIN",
                    messageType: "Error",
                    message: "You cannot transfer UMID within the same bin.",
                    category: "RECEIVING",
                    modifiedDate: new Date(COMMON.getCurrentUTC()),
                    action: "U"
                }]
            };
            break;
        case 276:
            msgobj = {
                messageBuildNumber: 277,
                developer: "Ketan",
                message: [
                    {
                        messageCode: "MFG20116",
                        messageKey: "CUSTOMER_INVOICE_BILLTO_SHIPTO_MISSING",
                        messageType: "Error",
                        message: "Please add <b>Shipping Address</b> and <b>Billing Address</b> detail.",
                        category: "MFG",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "U"
                    }
                ]
            };
            break;
        case 277:
            msgobj = {
                messageBuildNumber: 278,
                developer: "Ketan",
                message: [
                    {
                        messageCode: "MFG40071",
                        messageKey: "SO_PONUMBER_REPLACE_CONFIRM_WITH_DETAIL",
                        messageType: "Confirmation",
                        message: "Customer PO#: <b>{0}</b> will be replaced by PO#: <b>{1}</b> for  current SO# <b>{2}</b>. Press Yes to Continue.<br/>\
                                    <p>Following details will be copied from Original PO#</p> \
                                    <ul> \
                                    <li>Sales Commission To </li> \
                                    <li>Terms </li> \
                                    <li>Shipping Method </li> \
                                    <li>Carrier</li> \
                                    <li>Carrier Account#</li> \
                                    <li>FOB</li> \
                                    <li>Header Internal Notes</li> \
                                    <li>Header Shipping Comments</li> \
                                    <li>Billing Address</li> \
                                    <li>Shipping Address</li> \
                                    <li>Mark For (Intermediate Ship To) Address</li> \
                                    </ul>",
                        category: "MFG",
                        modifiedDate: new Date(COMMON.getCurrentUTC()),
                        action: "U"
                    }
                ]
            };
            break;
        case 278:
            msgobj = {
                messageBuildNumber: 279,
                developer: "Ketan",
                message: [
                    {
                        messageCode: "MFG20025",
                        messageKey: "CUSTOMER_PACKING_SHIP_ALERT",
                        messageType: "Error",
                        message: "Please add Shipping Address detail.",
                        category: "MFG",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "U"
                    }
                ]
            };
            break;
        case 279:
            msgobj = {
                messageBuildNumber: 280,
                developer: "Ketan",
                message: [
                    {
                        messageCode: "MFG50026",
                        messageKey: "CUSTOMER_PACKING_SLIP_ADDRESS_SHIPPING_MISMATCH",
                        messageType: "Information",
                        message: "You cannot add shipping details because selected packing slip shipping address or shipping method does not match with default shipping address or shipping method.",
                        category: "MFG",
                        modifiedDate: new Date(COMMON.getCurrentUTC()),
                        action: "U"
                    }
                ]
            };
            break;
        case 280:
            msgobj = {
                messageBuildNumber: 281,
                developer: "Ketan",
                message: [
                    {
                        messageKey: "PAY_TO_ADDRESS_NOT_ADDED_YET",
                        category: "RECEIVING",
                        messageType: "Information",
                        messageCode: "RCV50044",
                        message: "No remit to address added yet.",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "U"
                    }
                ]
            };
            break;
        case 281:
            msgobj = {
                messageBuildNumber: 282,
                developer: "SHUBHAM",
                message: [
                    {
                        messageKey: "ADD_ALTERNATE_PART_CPN_WITH_AVL_CONFIRMATION",
                        category: "MASTER",
                        messageType: "Confirmation",
                        messageCode: "MST40047",
                        message: "Do you want to add {0} as an AVL of CPN {1} ? Press Yes to Continue.",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "U"
                    }
                ]
            };
            break;
        case 282:
            msgobj = {
                messageBuildNumber: 283,
                developer: "SHUBHAM",
                message: [
                    {
                        messageKey: "UPDATE_SINGLE_ATTRIBUTE_CONFRIMATION",
                        category: "PARTS",
                        messageType: "Confirmation",
                        messageCode: "PRT40040",
                        message: "Alert! <br />All mismatched {0} will be updated per selected part's {0} in part master.<br />Press Yes to Continue.",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "U"
                    }
                ]
            };
            break;
        case 283:
            msgobj = {
                messageBuildNumber: 284,
                developer: "SHUBHAM",
                message: [
                    {
                        messageKey: "CONFIRM_ON_CHNAGE_BASE_PART",
                        category: "PARTS",
                        messageType: "Confirmation",
                        messageCode: "PRT40041",
                        message: "Are you sure you want to change your selection to {0}? Press Yes to Continue.",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "U"
                    }
                ]
            };
            break;
        case 284:
            msgobj = {
                messageBuildNumber: 285,
                developer: "Bhavik",
                message: [
                    {
                        messageCode: "MST40040",
                        messageKey: "RELEASE_CONT_PERSON",
                        messageType: "Confirmation",
                        message: "Are you sure you want to release <b>{0}</b> from functional user account <b>{1}</b> ? Press Yes to Continue",
                        category: "MASTER",
                        modifiedDate: new Date(COMMON.getCurrentUTC()),
                        action: "U"
                    }
                ]
            };
            break;
        case 285:
            msgobj = {
                messageBuildNumber: 286,
                developer: "Bhavik",
                message: [
                    {
                        messageCode: "MST40041",
                        messageKey: "CONT_PERSON_NOT_ASSIGNED",
                        messageType: "Confirmation",
                        message: "Selected Contact Person is not assigned to functional user account yet. Do you want to continue?",
                        category: "MASTER",
                        modifiedDate: new Date(COMMON.getCurrentUTC()),
                        action: "U"
                    }
                ]
            };
            break;
        case 286:
            msgobj = {
                messageBuildNumber: 287,
                developer: "Bhavik",
                message: [
                    {
                        messageCode: "GLB40003",
                        messageKey: "CHANGE_PERSONNEL_PERMISSION_SEND_NOTIFICATION",
                        messageType: "Confirmation",
                        message: "User is required to re-login from all active sessions. Click on \"Save & Send Notification\" to Save and notify the person.",
                        category: "GLOBAL",
                        modifiedDate: new Date(COMMON.getCurrentUTC()),
                        action: "U"
                    }
                ]
            };
            break;
        case 287:
            msgobj = {
                messageBuildNumber: 288,
                developer: "Bhavik",
                message: [
                    {
                        messageCode: "GLB40048",
                        messageKey: "CHANGE_PERMISSION_GET_NOTIFICATION",
                        messageType: "Confirmation",
                        message: "Personal Information has changed which requires re-login. Please save your information and login again.",
                        category: "GLOBAL",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 288:
            msgobj = {
                messageBuildNumber: 289,
                developer: "Bhavik",
                message: [
                    {
                        messageCode: "MST40045",
                        messageKey: "OLD_CONT_PERSON_RELEASED",
                        messageType: "Confirmation",
                        message: "<b>{0}</b> will be released from functional user account <b>{1}</b> once you assign <b>{2}</b>. Change will be effective only upon saving. Press Yes to continue.",
                        category: "MASTER",
                        modifiedDate: new Date(COMMON.getCurrentUTC()),
                        action: "U"
                    }
                ]
            };
            break;
        case 289:
            msgobj = {
                messageBuildNumber: 290,
                developer: "Bhavik",
                message: [
                    {
                        messageCode: "MST40043",
                        messageKey: "REMOVE_ALL_CONFIRMATION",
                        messageType: "Confirmation",
                        message: "This will remove all entered <b>\"{0}\"</b>. Press Yes to continue.",
                        category: "MASTER",
                        modifiedDate: new Date(COMMON.getCurrentUTC()),
                        action: "U"
                    }
                ]
            };
            break;
        case 290:
            msgobj = {
                messageBuildNumber: 291,
                developer: "Shweta",
                message: [
                    {
                        messageCode: "MFG50048",
                        messageKey: "SO_ASSYID_SHIP_VALIDATION",
                        messageType: "Information",
                        message: "Completed PO Line cannot be updated.<br/>Assy ID/PID: {0} | MPN: {1} is shipped with customer packing slip(s) {2}.",
                        category: "MFG",
                        modifiedDate: new Date(COMMON.getCurrentUTC()),
                        action: "U"
                    }
                ]
            };
            break;
        case 291:
            msgobj = {
                messageBuildNumber: 292,
                developer: "Shweta",
                message: [
                    {
                        messageCode: "MFG40035",
                        messageKey: "CONFIRMATION_DELETE_SALES_ORDER_DETAIL",
                        messageType: "Confirmation",
                        message: "PO Line#: {0} will be deleted. Press Yes to Continue.",
                        category: "MFG",
                        modifiedDate: new Date(COMMON.getCurrentUTC()),
                        action: "U"
                    }
                ]
            };
            break;
        case 292:
            msgobj = {
                messageBuildNumber: 293,
                developer: "Shweta",
                message: [
                    {
                        messageCode: "MFG40078",
                        messageKey: "CONFIRMATION_DELETE_SALES_ORDER_DETAIL_WITH_KIT",
                        messageType: "Confirmation",
                        message: "PO Line#: {0} will be deleted and any allocated material will be deallocated from associated kit(s). Press Yes to Continue.",
                        category: "MFG",
                        modifiedDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 293:
            msgobj = {
                messageBuildNumber: 294,
                developer: "Shweta",
                message: [
                    {
                        messageCode: "MFG20233",
                        messageKey: "SO_CUSTPOLINE_SOLINE_DUPLICATE",
                        messageType: "Error",
                        message: "Entered <b>{0}</b>: <b>{1}</b> already used for <b>MPN: {2}</b> in current <b>SO#: {3}</b>.",
                        category: "MFG",
                        modifiedDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 294:
            msgobj = {
                messageBuildNumber: 295,
                developer: "Bhavik",
                message: [
                    {
                        messageCode: "MST40048",
                        messageKey: "REMOVE_FROM_PRIMARY",
                        messageType: "Confirmation",
                        message: "Are you sure you want to unset <b>{0}</b> from primary contact person. Press Yes to continue.",
                        category: "MASTER",
                        modifiedDate: new Date(COMMON.getCurrentUTC()),
                        action: "U"
                    }
                ]
            };
            break;
        case 295:
            msgobj = {
                messageBuildNumber: 296,
                developer: "Bhavik",
                message: [
                    {
                        messageCode: "MST50038",
                        messageKey: "FIRST_EMAIL_PHONE_PRIMARY_REQUIRED",
                        messageType: "Information",
                        message: "First <b>\"{0}\"</b> must required to be set as primary.",
                        category: "MASTER",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 296:
            msgobj = {
                messageBuildNumber: 297,
                developer: "Bhavik",
                message: [
                    {
                        messageCode: "MST50039",
                        messageKey: "CONT_PERSON_ALREADY_ASSIGNED",
                        messageType: "Information",
                        message: "<b>{0}</b> is already assigned as functional user account of <b>{1}</b>.",
                        category: "MASTER",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 297:
            msgobj = {
                messageBuildNumber: 298,
                developer: "Bhavik",
                message: [
                    {
                        messageCode: "MST50038",
                        messageKey: "RELEASE_CURRENT_CONT_PERSON",
                        messageType: "Information",
                        message: "In prior to change the User Account Type, Please release the added contact person.",
                        category: "MASTER",
                        modifiedDate: new Date(COMMON.getCurrentUTC()),
                        action: "U"
                    }
                ]
            };
            break;
        case 298:
            msgobj = {
                messageBuildNumber: 299,
                developer: "SHUBHAM",
                message: [
                    {
                        messageCode: "PRT40042",
                        messageKey: "DELETE_CONFIRM_CONFIGURE_SERIAL",
                        messageType: "Confirmation",
                        message: "Are you sure you want to remove <b>Serial# Configuration</b>? Press Yes to Continue.",
                        category: "PARTS",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "U"
                    }
                ]
            };
            break;
        case 299:
            msgobj = {
                messageBuildNumber: 300,
                developer: "SHUBHAM",
                message: [
                    {
                        messageCode: "PRT40043",
                        messageKey: "MAX_LENGTH_MPN_IMPORT",
                        messageType: "Confirmation",
                        message: "Maximum length limit exceeded for the following parts. Listed parts excluded while importing. Are you sure you want to continue?",
                        category: "PARTS",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        default:
            break;
    }
    return msgobj;
});


// sample
// case 1 :
// msgobj = {
//     messageBuildNumber : 1 ,
//     developer : "Shweta",
//     message : [
//         {
//             messageCode : "GLB50003",
//             messageKey : "DownloadFileErrorMsg_Unauthorized",
//             messageType : "Information",
//             message : "You are not authorized to download document. Please contact administrator.",
//             category : "Global",
//             createdDate :  new Date(COMMON.getCurrentUTC()),
//             action : "I"
//         } ,
//         {
//             messageKey  :"DownloadFileErrorMsg_Unauthorized",
//             messageCode : "GLB50009",
//             messageType : "Information",
//             message : "You are not authorized to download document. Please contact administrator.",
//             category : "Global",
//             modifiedDate : new Date(COMMON.getCurrentUTC()),
//             action : "U"
//         },
//         {
//             messageKey : "WITHOUT_SAVING_ALERT_BODY_MESSAGE",
//             messageCode : "GLB40004",
//             category: "GLOBAL",
//             deletedDate :  new Date(COMMON.getCurrentUTC()) ,
//             action : "D"
//         },
//     ]
// };
//LOGIC FOR CODE :=>
//GLB20001 : GLB 2 0001
//---------------------
//GLB : GLOBAL
//USR : USER
//ADM : ADMIN
//---------------------
//1 - for Success
//2 - for Error
//3 - for Warning
//4 - for Confirmation
//5 - for Information
//-------------------
//LAST 4 DIGITS
//0001--9999
// INCREMENTAL VALUE 
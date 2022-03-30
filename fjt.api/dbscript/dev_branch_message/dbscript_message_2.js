(function (newBuild) {
    //var arrMessageBuild =[];
    var msgobj = {};
    switch (newBuild) {
        case 500:
            msgobj = {
                messageBuildNumber: 501,
                developer: "Shweta",
                message: [{
                    messageCode: "MST20037",
                    messageKey: "OPERATION_DATAELEMENT_NOT_UPDATED",
                    messageType: "Error",
                    message: "Operation data field could not be updated.",
                    category: "MASTER",
                    createdDate: new Date(COMMON.getCurrentUTC()),
                    action: "I"
                }]
            };
            break;
        case 501:
            msgobj = {
                messageBuildNumber: 502,
                developer: "Shweta",
                message: [{
                    messageCode: "MST10043",
                    messageKey: "OPERATION_DATAELEMENT_DELETED",
                    messageType: "Success",
                    message: "Operation data field deleted successfully.",
                    category: "MASTER",
                    createdDate: new Date(COMMON.getCurrentUTC()),
                    action: "I"
                }]
            };
            break;
        case 502:
            msgobj = {
                messageBuildNumber: 503,
                developer: "Shweta",
                message: [{
                    messageCode: "MST20038",
                    messageKey: "OPERATION_DATAELEMENT_NOT_DELETED",
                    messageType: "Error",
                    message: "Operation data field could not be deleted.",
                    category: "MASTER",
                    createdDate: new Date(COMMON.getCurrentUTC()),
                    action: "I"
                }]
            };
            break;
        case 503:
            msgobj = {
                messageBuildNumber: 504,
                developer: "Shweta",
                message: [{
                    messageCode: "MST10044",
                    messageKey: "DATAELEMENT_DELETED_FROM_OPERATION",
                    messageType: "Success",
                    message: "Data field removed from operation.",
                    category: "MASTER",
                    createdDate: new Date(COMMON.getCurrentUTC()),
                    action: "I"
                }]
            };
            break;
        case 504:
            msgobj = {
                messageBuildNumber: 505,
                developer: "Shweta",
                message: [{
                    messageCode: "MST10045",
                    messageKey: "DATAELEMENT_ADDED_TO_OPERATION",
                    messageType: "Success",
                    message: "Data field added to operation.",
                    category: "MASTER",
                    createdDate: new Date(COMMON.getCurrentUTC()),
                    action: "I"
                }]
            };
            break;
        case 505:
            msgobj = {
                messageBuildNumber: 506,
                developer: "Shweta",
                message: [{
                    messageCode: "MST10046",
                    messageKey: "DATAELEMENT_ORDER_UPDATED",
                    messageType: "Success",
                    message: "Order of data field updated.",
                    category: "MASTER",
                    createdDate: new Date(COMMON.getCurrentUTC()),
                    action: "I"
                }]
            };
            break;
        case 506:
            msgobj = {
                messageBuildNumber: 507,
                developer: "Shweta",
                message: [{
                    messageCode: "MST20039",
                    messageKey: "OPERATION_EQUIPMENT_NOT_FOUND",
                    messageType: "Error",
                    message: "Operation equipment not Found.",
                    category: "MASTER",
                    createdDate: new Date(COMMON.getCurrentUTC()),
                    action: "I"
                }]
            };
            break;
        case 507:
            msgobj = {
                messageBuildNumber: 508,
                developer: "Shweta",
                message: [{
                    messageCode: "MST10047",
                    messageKey: "EQUIPMENT_ADDED_TO_OPERATION",
                    messageType: "Success",
                    message: "Equipment(s) added to operation.",
                    category: "MASTER",
                    createdDate: new Date(COMMON.getCurrentUTC()),
                    action: "I"
                }]
            };
            break;
        case 508:
            msgobj = {
                messageBuildNumber: 509,
                developer: "Shweta",
                message: [{
                    messageCode: "MST50025",
                    messageKey: "DEFECTCATEGORY_EXITS_DEFECTDESIGNATOR",
                    messageType: "Information",
                    message: "Record is not removed as its references exists.",
                    category: "MASTER",
                    createdDate: new Date(COMMON.getCurrentUTC()),
                    action: "I"
                }]
            };
            break;
        case 509:
            msgobj = {
                messageBuildNumber: 510,
                developer: "Shweta",
                message: [{
                    messageCode: "MST50026",
                    messageKey: "DEFECTCATEGORY_EXITS_MULTI_DEFECTDESIGNATOR",
                    messageType: "Information",
                    message: "Few records are not removed as their references exists.",
                    category: "MASTER",
                    createdDate: new Date(COMMON.getCurrentUTC()),
                    action: "I"
                }]
            };
            break;
        case 510:
            msgobj = {
                messageBuildNumber: 511,
                developer: "Shweta",
                message: [{
                    messageCode: "MST10051",
                    messageKey: "STANDARD_MESSAGE_CREATED",
                    messageType: "Success",
                    message: "Predefined chat message created successfully.",
                    category: "MASTER",
                    createdDate: new Date(COMMON.getCurrentUTC()),
                    action: "I"
                }]
            };
            break;
        case 511:
            msgobj = {
                messageBuildNumber: 512,
                developer: "Shweta",
                message: [{
                    messageCode: "MST10052",
                    messageKey: "STANDARD_MESSAGE_UPDATED",
                    messageType: "Success",
                    message: "Predefined chat message updated successfully.",
                    category: "MASTER",
                    createdDate: new Date(COMMON.getCurrentUTC()),
                    action: "I"
                }]
            };
            break;
        case 512:
            msgobj = {
                messageBuildNumber: 513,
                developer: "Shweta",
                message: [{
                    messageCode: "MST10053",
                    messageKey: "STANDARD_MESSAGE_DELETED",
                    messageType: "Success",
                    message: "Predefined chat message deleted successfully.",
                    category: "MASTER",
                    createdDate: new Date(COMMON.getCurrentUTC()),
                    action: "I"
                }]
            };
            break;
        case 513:
            msgobj = {
                messageBuildNumber: 514,
                developer: "Shweta",
                message: [{
                    messageCode: "MST50027",
                    messageKey: "STANDARD_MESSAGE_NOT_DELETED",
                    messageType: "Information",
                    message: "Predefined chat message could not be deleted.",
                    category: "MASTER",
                    createdDate: new Date(COMMON.getCurrentUTC()),
                    action: "I"
                }]
            };
            break;
        case 514:
            msgobj = {
                messageBuildNumber: 515,
                developer: "Shweta",
                message: [{
                    messageCode: "MST50028",
                    messageKey: "STANDARD_MESSAGE_NOT_UPDATED",
                    messageType: "Information",
                    message: "Predefined chat message could not be updated.",
                    category: "MASTER",
                    createdDate: new Date(COMMON.getCurrentUTC()),
                    action: "I"
                }]
            };
            break;
        case 515:
            msgobj = {
                messageBuildNumber: 516,
                developer: "Fenil",
                message: [{
                    messageCode: "RCV20085",
                    messageKey: "KIT_RELEASE_DONE_FOR_SALES_ORDER",
                    messageType: "Error",
                    message: "Kit released already done for this assembly. You cannot change MFR PN.",
                    category: "RECEIVING",
                    createdDate: new Date(COMMON.getCurrentUTC()),
                    action: "I"
                }]
            };
            break;
        case 516:
            msgobj = {
                messageBuildNumber: 517,
                developer: "Champak",
                message: [{
                    messageCode: "MFG50002",
                    messageKey: "SALES_ORDER_STATUS_CHANGE",
                    messageType: "Information",
                    message: "In prior to publish sales order, you must have to fill up all required details of sales order.",
                    category: "MFG",
                    createdDate: new Date(COMMON.getCurrentUTC()),
                    action: "I"
                }]
            };
            break;

        case 517:
            msgobj = {
                messageBuildNumber: 518,
                developer: "Champak",
                message: [{
                    messageCode: "MFG40003",
                    messageKey: "SO_STATUS_CHANGE",
                    messageType: "Confirmation",
                    message: "Sales order status will be changed from {0} to {1}, Press Yes to Continue.",
                    category: "MFG",
                    createdDate: new Date(COMMON.getCurrentUTC()),
                    action: "I"
                }]
            };
            break;

        case 518:
            msgobj = {
                messageBuildNumber: 519,
                developer: "Champak",
                message: [{
                    messageCode: "MFG40004",
                    messageKey: "PLANN_NOT_CREATED",
                    messageType: "Confirmation",
                    message: "Plan kit not created for Assy <b>{0}</b>. Press Yes to Continue.",
                    category: "MFG",
                    createdDate: new Date(COMMON.getCurrentUTC()),
                    action: "I"
                }]
            };
            break;

        case 519:
            msgobj = {
                messageBuildNumber: 520,
                developer: "Champak",
                message: [{
                    messageCode: "MFG40005",
                    messageKey: "CHANGING_CUSTOMER",
                    messageType: "Confirmation",
                    message: "On changing customer, This will remove all assembly details with selected customer. Press Yes to Continue.",
                    category: "MFG",
                    createdDate: new Date(COMMON.getCurrentUTC()),
                    action: "I"
                }]
            };
            break;

        case 520:
            msgobj = {
                messageBuildNumber: 521,
                developer: "Champak",
                message: [{
                    messageCode: "MFG50003",
                    messageKey: "INVALID_SHIPPING",
                    messageType: "Information",
                    message: "Shipping count is mismatch with total number of release count.",
                    category: "MFG",
                    createdDate: new Date(COMMON.getCurrentUTC()),
                    action: "I"
                }]
            };
            break;

        case 521:
            msgobj = {
                messageBuildNumber: 522,
                developer: "Champak",
                message: [{
                    messageCode: "MFG50004",
                    messageKey: "INVALID_ASSEMBLY",
                    messageType: "Information",
                    message: "Assy ID price should be different.",
                    category: "MFG",
                    createdDate: new Date(COMMON.getCurrentUTC()),
                    action: "I"
                }]
            };
            break;

        case 522:
            msgobj = {
                messageBuildNumber: 523,
                developer: "Champak",
                message: [{
                    messageCode: "MFG50005",
                    messageKey: "GREATER_DATE",
                    messageType: "Information",
                    message: "{0} should be greater than {1}",
                    category: "MFG",
                    createdDate: new Date(COMMON.getCurrentUTC()),
                    action: "I"
                }]
            };
            break;

        case 523:
            msgobj = {
                messageBuildNumber: 524,
                developer: "Champak",
                message: [{
                    messageCode: "MFG50006",
                    messageKey: "INVALID_QUANTITY",
                    messageType: "Information",
                    message: "Invalid shipping quantity!",
                    category: "MFG",
                    createdDate: new Date(COMMON.getCurrentUTC()),
                    action: "I"
                }]
            };
            break;

        case 524:
            msgobj = {
                messageBuildNumber: 525,
                developer: "Champak",
                message: [{
                    messageCode: "MFG50007",
                    messageKey: "INVALID_ASSEMBLY_RECORD",
                    messageType: "Information",
                    message: "{0} is already existed with the same price.",
                    category: "MFG",
                    createdDate: new Date(COMMON.getCurrentUTC()),
                    action: "I"
                }]
            };
            break;

        case 525:
            msgobj = {
                messageBuildNumber: 526,
                developer: "Champak",
                message: [{
                    messageCode: "MFG50008",
                    messageKey: "KITQTY_VALIDATION_SO",
                    messageType: "Information",
                    message: "Kit is released. you cannot change kit detail.",
                    category: "MFG",
                    createdDate: new Date(COMMON.getCurrentUTC()),
                    action: "I"
                }]
            };
            break;

        case 526:
            msgobj = {
                messageBuildNumber: 527,
                developer: "Champak",
                message: [{
                    messageCode: "MFG50009",
                    messageKey: "INVALID_LINEID",
                    messageType: "Information",
                    message: "Invalid Line ID",
                    category: "MFG",
                    createdDate: new Date(COMMON.getCurrentUTC()),
                    action: "I"
                }]
            };
            break;

        case 527:
            msgobj = {
                messageBuildNumber: 528,
                developer: "Champak",
                message: [{
                    messageCode: "MFG50010",
                    messageKey: "PRODUCTION_STARTED_NOT_ALLOW_ANY_CHANGE",
                    messageType: "Information",
                    message: "Production has started. You cannot change in sales order details.",
                    category: "MFG",
                    createdDate: new Date(COMMON.getCurrentUTC()),
                    action: "I"
                }]
            };
            break;
        case 528:
            msgobj = {
                messageBuildNumber: 529,
                developer: "Ketan",
                message: [{
                    messageCode: "MST40019",
                    messageKey: "COPY_MIS_REPORT_CONFIRMATION",
                    messageType: "Confirmation",
                    message: "Are you sure want to copy report? All data will be copy from \"{0}\".",
                    category: "MASTER",
                    createdDate: new Date(COMMON.getCurrentUTC()),
                    action: "I"
                }]
            };
            break;
        case 529:
            msgobj = {
                messageBuildNumber: 530,
                developer: "Ketan",
                message: [{
                    messageCode: "MST50030",
                    messageKey: "PO_REPORT_WO_QTY_CALCULATION_NOTE",
                    messageType: "Information",
                    message: "Note: Data calculation is based on build quantity of main assembly. Sub-assembly not included.",
                    category: "MASTER",
                    createdDate: new Date(COMMON.getCurrentUTC()),
                    action: "I"
                }]
            };
            break;
        case 530:
            msgobj = {
                messageBuildNumber: 531,
                developer: "Vaibhav",
                message: [{
                    messageCode: "MFG20001",
                    messageKey: "MAPPING_SERIAL_NO_NOT_ALLOW",
                    messageType: "Error",
                    message: "Serial# mapping not allowed, Please configure allow mapping for operation.",
                    category: "MFG",
                    createdDate: new Date(COMMON.getCurrentUTC()),
                    action: "I" // I-insert, U-update
                }]
            };
            break;
        case 531:
            msgobj = {
                messageBuildNumber: 532,
                developer: "Vaibhav",
                message: [{
                    messageCode: "MFG50011",
                    messageKey: "SERIAL_MAPPING_ALLOW_AT_TRAVELER",
                    messageType: "Information",
                    message: "After selecting this allow to do mapping with serial# at traveler.",
                    category: "MFG",
                    createdDate: new Date(COMMON.getCurrentUTC()),
                    action: "I" // I-insert, U-update
                }]
            };
            break;
        case 532:
            msgobj = {
                messageBuildNumber: 533,
                developer: "Ketan",
                message: [{
                    messageCode: "MST50030",
                    messageKey: "PO_REPORT_WO_QTY_CALCULATION_NOTE",
                    messageType: "Information",
                    message: "Note: Data calculation is based on build quantity of main assembly.",
                    category: "MASTER",
                    createdDate: new Date(COMMON.getCurrentUTC()),
                    action: "U"
                }]
            };
            break;
        case 533:
            msgobj = {
                messageBuildNumber: 534,
                developer: "Champak",
                message: [{
                    messageCode: "RCV50020",
                    messageKey: "SEARCH_ONLY_SMART_CART_UMID",
                    messageType: "Information",
                    message: "Selected UMID(s) are not belong to smart cart warehouse. To show light, Please select smart cart UMID(s) only.",
                    category: "RECEIVING",
                    createdDate: new Date(COMMON.getCurrentUTC()),
                    action: "I" // I-insert, U-update
                }]
            };
            break;
        case 534:
            msgobj = {
                messageBuildNumber: 535,
                developer: "Shirish",
                message: [{
                    messageCode: "MST50029",
                    messageKey: "DISCRIPTION_COPY_TO_CLIPBORD",
                    messageType: "Information",
                    message: "Default description copied to clipboard.",
                    category: "MASTER",
                    createdDate: new Date(COMMON.getCurrentUTC()),
                    action: "I"
                }]
            };
            break;
        case 535:
            msgobj = {
                messageBuildNumber: 536,
                developer: "Shirish",
                message: [{
                    messageCode: "MST40020",
                    messageKey: "RESTRICT_CONF_TEXT",
                    messageType: "Confirmation",
                    message: "Are you sure you want to apply Restrict Transaction Setting on the selected Error codes?",
                    category: "MASTER",
                    createdDate: new Date(COMMON.getCurrentUTC()),
                    action: "I"
                }]
            };
            break;
        case 536:
            msgobj = {
                messageBuildNumber: 537,
                developer: "Shirish",
                message: [{
                    messageCode: "MST40021",
                    messageKey: "ERRORCODE_VALIDATION",
                    messageType: "Confirmation",
                    message: "Changes into error code may effect existing BOM's error status. Do you want to continue?",
                    category: "MASTER",
                    createdDate: new Date(COMMON.getCurrentUTC()),
                    action: "I"
                }]
            };
            break;
        case 537:
            msgobj = {
                messageBuildNumber: 538,
                developer: "Vaibhav",
                message: [{
                    messageCode: "MFG20005",
                    messageKey: "MFG_SERIAL_ALREADY_MAPPED",
                    messageType: "Error",
                    message: "MFR serial# \"{0}\" already mapped with product serial# \"{1}\".",
                    category: "MFG",
                    createdDate: new Date(COMMON.getCurrentUTC()),
                    action: "U"
                }]
            };
            break;
        case 538:
            msgobj = {
                messageBuildNumber: 539,
                developer: "Vaibhav",
                message: [{
                    messageCode: "MFG20006",
                    messageKey: "PRODUCT_SERIAL_ALREADY_MAPPED",
                    messageType: "Error",
                    message: "Product serial# \"{0}\" already mapped with MFR serial# \"{1}\".",
                    category: "MFG",
                    createdDate: new Date(COMMON.getCurrentUTC()),
                    action: "U"
                }]
            };
            break;
        case 539:
            msgobj = {
                messageBuildNumber: 540,
                developer: "Ketan",
                message: [{
                    messageCode: "MST10054",
                    messageKey: "REPORT_PIN_TO_DASHBOARD",
                    messageType: "Success",
                    message: "Report {0} is pinned to the dashboard.",
                    category: "MASTER",
                    createdDate: new Date(COMMON.getCurrentUTC()),
                    action: "I"
                }]
            };
            break;
        case 540:
            msgobj = {
                messageBuildNumber: 541,
                developer: "Ketan",
                message: [{
                    messageCode: "MST10055",
                    messageKey: "REPORT_UNPIN_FROM_DASHBOARD",
                    messageType: "Success",
                    message: "Report {0} is unpinned from the dashboard.",
                    category: "MASTER",
                    createdDate: new Date(COMMON.getCurrentUTC()),
                    action: "I"
                }]
            };
            break;
        case 541:
            msgobj = {
                messageBuildNumber: 542,
                developer: "Ketan",
                message: [{
                    messageCode: "MST10056",
                    messageKey: "EMP_ASSIGN_TO_REPORT_ACCESS",
                    messageType: "Success",
                    message: "Personnel assigned to {0}.",
                    category: "MASTER",
                    createdDate: new Date(COMMON.getCurrentUTC()),
                    action: "I"
                }]
            };
            break;
        case 542:
            msgobj = {
                messageBuildNumber: 543,
                developer: "Ketan",
                message: [{
                    messageCode: "MST10057",
                    messageKey: "EMP_DELETED_FROM_REPORT_ACCESS",
                    messageType: "Success",
                    message: "Personnel removed from {0}.",
                    category: "MASTER",
                    createdDate: new Date(COMMON.getCurrentUTC()),
                    action: "I"
                }]
            };
            break;
        case 543:
            msgobj = {
                messageBuildNumber: 544,
                developer: "Champak",
                message: [{
                    messageCode: "RCV0021",
                    messageKey: "CART_EMPTY",
                    messageType: "Information",
                    message: "<b>{0}</b> warehouse is empty.",
                    category: "RECEIVING",
                    createdDate: new Date(COMMON.getCurrentUTC()),
                    action: "I"
                }]
            };
            break;
        case 544:
            msgobj = {
                messageBuildNumber: 545,
                developer: "Champak",
                message: [{
                    messageCode: "RCV0022",
                    messageKey: "SCAN_CART_NOT_FOUND",
                    messageType: "Information",
                    message: "Scanned <b>{0}</b> warehouse not found.",
                    category: "RECEIVING",
                    createdDate: new Date(COMMON.getCurrentUTC()),
                    action: "I"
                }]
            };
            break;
        case 545:
            msgobj = {
                messageBuildNumber: 546,
                developer: "Dharmishtha",
                message: [{
                    messageCode: "GLB20023",
                    messageKey: "TEXT_EDITOR_CONFIGURATION_MISSING",
                    messageType: "Error",
                    message: "System configuration is missing for text editor. Please contact to administrator/developer.",
                    category: "RECEIVING",
                    createdDate: new Date(COMMON.getCurrentUTC()),
                    action: "I"
                }]
            };
            break;
        case 546:
            msgobj = {
                messageBuildNumber: 547,
                developer: "Dharmishtha",
                message: [{
                    messageCode: "GLB20016",
                    messageKey: "DocumentSizeError_NotAllowed",
                    messageType: "Error",
                    message: "Document size more than {0} is not allowed.",
                    category: "GLOBAL",
                    createdDate: new Date(COMMON.getCurrentUTC()),
                    action: "U"
                }]
            };
            break;
        case 547:
            msgobj = {
                messageBuildNumber: 548,
                developer: "Dharmishtha",
                message: [{
                    messageCode: "GLB50018",
                    messageKey: "DOCUMENT_VIDEO_ALLOW_FORMAT_MSG",
                    messageType: "Information",
                    message: "Only {0} format video allowed.",
                    category: "GLOBAL",
                    createdDate: new Date(COMMON.getCurrentUTC()),
                    action: "I"
                }]
            };
            break;
        case 548:
            msgobj = {
                messageBuildNumber: 549,
                developer: "Dharmishtha",
                message: [{
                    messageCode: "GLB20028",
                    messageKey: "TEXT_EDITOR_ACCEPT_VIDEO_IMAGE",
                    messageType: "Information",
                    message: "Only images and video files are allowed.",
                    category: "GLOBAL",
                    createdDate: new Date(COMMON.getCurrentUTC()),
                    action: "I"
                }]
            };
            break;
        case 549:
            msgobj = {
                messageBuildNumber: 550,
                developer: "Ashish",
                message: [{
                    messageCode: "MST20045",
                    messageKey: "EQUIPMENT_AND_WORKSTATION_VALIDATION",
                    messageType: "Error",
                    message: "Equipment, Workstation & Sample Name must be unique.",
                    category: "MASTER",
                    createdDate: new Date(COMMON.getCurrentUTC()),
                    action: "I"
                }]
            };
            break;
        case 550:
            msgobj = {
                messageBuildNumber: 551,
                developer: "Ashish",
                message: [{
                    messageCode: "GLB20030",
                    messageKey: "REQUIRED",
                    messageType: "Error",
                    message: "{0} required!",
                    category: "GLOBAL",
                    createdDate: new Date(COMMON.getCurrentUTC()),
                    action: "I"
                }]
            };
            break;
        case 551:
            msgobj = {
                messageBuildNumber: 552,
                developer: "Ashish",
                message: [{
                    messageCode: "GLB20031",
                    messageKey: "NOT_EXISTS",
                    messageType: "Error",
                    message: "{0} not exists!",
                    category: "GLOBAL",
                    createdDate: new Date(COMMON.getCurrentUTC()),
                    action: "I"
                }]
            };
            break;
        case 552:
            msgobj = {
                messageBuildNumber: 553,
                developer: "Ashish",
                message: [{
                    messageCode: "GLB20032",
                    messageKey: "ALREADY_EXISTS",
                    messageType: "Error",
                    message: "{0} already exists!",
                    category: "GLOBAL",
                    createdDate: new Date(COMMON.getCurrentUTC()),
                    action: "I"
                }]
            };
            break;
        case 553:
            msgobj = {
                messageBuildNumber: 554,
                developer: "Ashish",
                message: [{
                    messageCode: "MST20046",
                    messageKey: "SAMPLE_SHOULD_BE_ONE_FOR_ASSEMBLY",
                    messageType: "Error",
                    message: "Multiple samples for same assembly not allowed.",
                    category: "MASTER",
                    createdDate: new Date(COMMON.getCurrentUTC()),
                    action: "I"
                }]
            };
            break;
        case 554:
            msgobj = {
                messageBuildNumber: 555,
                developer: "Shubham",
                message: [{
                    messageCode: "GLB50019",
                    messageKey: "FILE_PREVIEW_NOT_AVAILABLE",
                    messageType: "Information",
                    message: "File preview not available!",
                    category: "GLOBAL",
                    createdDate: new Date(COMMON.getCurrentUTC()),
                    action: "I"
                }]
            };
            break;
        case 555:
            msgobj = {
                messageBuildNumber: 556,
                developer: "Vaibhav",
                message: [{
                    messageCode: "MFG20002",
                    messageKey: "INVALID_LOOP_OPERATION",
                    messageType: "Error",
                    message: "First operation cannot be loop operation.",
                    category: "MFG",
                    createdDate: new Date(COMMON.getCurrentUTC()),
                    action: "I"
                }]
            };
            break;
        case 556:
            msgobj = {
                messageBuildNumber: 557,
                developer: "Vaibhav",
                message: [{
                    messageCode: "MFG50012",
                    messageKey: "LOOP_OPERATION_INFO",
                    messageType: "Information",
                    message: "Loop operation allow to do pass qty in previous operation at traveler page.",
                    category: "MFG",
                    createdDate: new Date(COMMON.getCurrentUTC()),
                    action: "I"
                }]
            };
            break;
        case 557:
            msgobj = {
                messageBuildNumber: 558,
                developer: "Shirish",
                message: [{
                    messageCode: "MFG20015",
                    messageKey: "SCAN_VALID_SERIAL_NUMBER",
                    messageType: "Error",
                    message: "Please enter or scan valid Serial#.",
                    category: "MFG",
                    createdDate: new Date(COMMON.getCurrentUTC()),
                    action: "I"
                }]
            };
            break;
        case 558:
            msgobj = {
                messageBuildNumber: 559,
                developer: "Dharmesh",
                message: [{
                    messageCode: "RCV20086",
                    messageKey: "ALREADY_HOLDRESUME",
                    messageType: "Error",
                    message: "{0} is already {1} by <b>{2}</b>.",
                    category: "RECEIVING",
                    createdDate: new Date(COMMON.getCurrentUTC()),
                    action: "I"
                }]
            };
            break;
        case 559:
            msgobj = {
                messageBuildNumber: 560,
                developer: "Dharmesh",
                message: [{
                    messageCode: "RCV0023",
                    messageKey: "PO_KIT_ON_HOLD",
                    messageType: "Information",
                    message: "You can not allocate UMID to kit, as PO or Kit Allocation for <b>PO# {0}, SO# {1}, AssyID {2}</b> is on hold.",
                    category: "RECEIVING",
                    createdDate: new Date(COMMON.getCurrentUTC()),
                    action: "I"
                }]
            };
            break;


        case 560:
            msgobj = {
                messageBuildNumber: 561,
                developer: "Dharmesh",
                message: [{
                    messageCode: "RCV30010",
                    messageKey: "PACKING_SLIP_SO_ASSOCIATE_TO_OTHER_PO",
                    messageType: "Warning",
                    category: "RECEIVING",
                    deletedDate: new Date(COMMON.getCurrentUTC()),
                    action: "D"
                }]
            };
            break;
        case 561:
            msgobj = {
                messageBuildNumber: 562,
                developer: "Dharmesh",
                message: [{
                    messageCode: "RCV20087",
                    messageKey: "PACKING_SLIP_SO_ASSOCIATE_TO_OTHER_PO",
                    messageType: "Error",
                    message: "This sales order <b>{0}</b> is associated with purchase order <b>{1}</b>. Please verify it.",
                    category: "RECEIVING",
                    createdDate: new Date(COMMON.getCurrentUTC()),
                    action: "I"


                }]
            };
            break;

        case 562:
            msgobj = {
                messageBuildNumber: 563,
                developer: "Dharmesh",
                message: [{
                    messageCode: "RCV20041",
                    messageKey: "SHOW_DEBIT_MEMO_NUMBER",
                    messageType: "Information",
                    category: "RECEIVING",
                    deletedDate: new Date(COMMON.getCurrentUTC()),
                    action: "D"
                }]
            };
            break;

        case 563:
            msgobj = {
                messageBuildNumber: 564,
                developer: "Dharmesh",
                message: [{
                    messageCode: "RCV10006",
                    messageKey: "SHOW_DEBIT_MEMO_NUMBER",
                    messageType: "Success",
                    message: "Debit memo <b>{0}</b> is generated successfully.",
                    category: "RECEIVING",
                    createdDate: new Date(COMMON.getCurrentUTC()),
                    action: "I"
                }]
            };
            break;
        case 564:
            msgobj = {
                messageBuildNumber: 565,
                developer: "Shweta",
                message: [{
                    messageCode: "MST20040",
                    messageKey: "UNIT_DETAIL_FORMULA_UNIQUE",
                    messageType: "Error",
                    message: "Formula already exists.",
                    category: "MASTER",
                    createdDate: new Date(COMMON.getCurrentUTC()),
                    action: "I"
                }]
            };
            break;
        case 565:
            msgobj = {
                messageBuildNumber: 566,
                developer: "Shweta",
                message: [{
                    messageCode: "MST20041",
                    messageKey: "INVALID_FORMULA",
                    messageType: "Error",
                    message: "Please enter valid formula in terms of X",
                    category: "MASTER",
                    createdDate: new Date(COMMON.getCurrentUTC()),
                    action: "I"
                }]
            };
            break;
        case 566:
            msgobj = {
                messageBuildNumber: 567,
                developer: "Shweta",
                message: [{
                    messageCode: "GLB20029",
                    messageKey: "DELETE_ALERT_MESSAGE",
                    messageType: "Error",
                    message: "Selected record(s) cannot be deleted as it is in use.",
                    category: "GLOBAL",
                    createdDate: new Date(COMMON.getCurrentUTC()),
                    action: "I"
                }]
            };
            break;
        case 567:
            msgobj = {
                messageBuildNumber: 567,
                developer: "Shweta",
                message: [{
                    messageCode: "MST20042",
                    messageKey: "FUNCTIONALTYPE_VALIDATIONTYPE_FIELD_UNIQUE",
                    messageType: "Error",
                    message: "Entry already exists for functional type,Validation type and field!",
                    category: "MASTER",
                    createdDate: new Date(COMMON.getCurrentUTC()),
                    action: "I"
                }]
            };
            break;
        case 568:
            msgobj = {
                messageBuildNumber: 569,
                developer: "Shweta",
                message: [{
                    messageCode: "MST20043",
                    messageKey: "ALTERNATE_PART_NOT_FOUND",
                    messageType: "Error",
                    message: "Entry for {0} not found, please check.",
                    category: "MASTER",
                    createdDate: new Date(COMMON.getCurrentUTC()),
                    action: "I"
                }]
            };
            break;
        case 569:
            msgobj = {
                messageBuildNumber: 570,
                developer: "Shweta",
                message: [{
                    messageCode: "MST40022",
                    messageKey: "ALIAS_PART_VLIDATIONS_COPY_WITH_OVERRIDE",
                    messageType: "Confirmation",
                    message: "All validations will be copied from <b>{0}</b> functional type to selected functional type(s).<br><b>Existing validations will be override if any.</b><br>Are you sure to copy? Press Yes to continue.",
                    category: "MASTER",
                    createdDate: new Date(COMMON.getCurrentUTC()),
                    action: "I"
                }]
            };
            break;
        case 570:
            msgobj = {
                messageBuildNumber: 571,
                developer: "Shweta",
                message: [{
                    messageCode: "MST40023",
                    messageKey: "ALIAS_PART_VLIDATIONS_COPY",
                    messageType: "Confirmation",
                    message: "All validations will be copied from <b>{0}</b> functional type to selected functional type(s).<br>Are you sure to copy? Press Yes to continue.",
                    category: "MASTER",
                    createdDate: new Date(COMMON.getCurrentUTC()),
                    action: "I"
                }]
            };
            break;
        case 571:
            msgobj = {
                messageBuildNumber: 572,
                developer: "Shweta",
                message: [{
                    messageCode: "MST40024",
                    messageKey: "DELETE_ALIAS_CONFIRM_MESSAGE",
                    messageType: "Confirmation",
                    message: "This change will affect work order, work order operation and production.",
                    category: "MASTER",
                    createdDate: new Date(COMMON.getCurrentUTC()),
                    action: "I"
                }]
            };
            break;
        case 572:
            msgobj = {
                messageBuildNumber: 573,
                developer: "Shweta",
                message: [{
                    messageCode: "MST20044",
                    messageKey: "TYPE_ALREADY_ADDED",
                    messageType: "Error",
                    message: "Mounting type(s) \"{0}\" already added in other mounting group.",
                    category: "MASTER",
                    createdDate: new Date(COMMON.getCurrentUTC()),
                    action: "I"
                }]
            };
            break;
        case 573:
            msgobj = {
                messageBuildNumber: 574,
                developer: "Shweta",
                message: [{
                    messageCode: "MST20047",
                    messageKey: "LABOR_SELECT_PRICE_TYPE",
                    messageType: "Error",
                    message: "Please select price type first to import labor cost template data.",
                    category: "MASTER",
                    createdDate: new Date(COMMON.getCurrentUTC()),
                    action: "I"
                }]
            };
            break;
        case 574:
            msgobj = {
                messageBuildNumber: 575,
                developer: "Shweta",
                message: [{
                    messageCode: "RFQ20004",
                    messageKey: "BOM_UPLOAD_FAIL_TEXT",
                    messageType: "Error",
                    message: "Please upload valid .xlsx document.",
                    category: "RFQ",
                    createdDate: new Date(COMMON.getCurrentUTC()),
                    action: "I"
                }]
            };
            break;
        case 575:
            msgobj = {
                messageBuildNumber: 576,
                developer: "Shweta",
                message: [{
                    messageCode: "MST20048",
                    messageKey: "PRICE_VALIDATION_MESSAGE",
                    messageType: "Error",
                    message: "Price must be less or equal to all lower price.",
                    category: "MASTER",
                    createdDate: new Date(COMMON.getCurrentUTC()),
                    action: "I"
                }]
            };
            break;
        case 576:
            msgobj = {
                messageBuildNumber: 577,
                developer: "Champak",
                message: [{
                    messageCode: "RCV50021",
                    messageKey: "SEARCH_CANCEL_TIMEOUT",
                    messageType: "Information",
                    message: "Search request Timeout.",
                    category: "RECEIVING",
                    createdDate: new Date(COMMON.getCurrentUTC()),
                    action: "I"
                }]
            };
            break;
        case 577:
            msgobj = {
                messageBuildNumber: 578,
                developer: "Champak",
                message: [{
                    messageCode: "RCV50022",
                    messageKey: "SEARCH_CANCEL_MANUALLY",
                    messageType: "Information",
                    message: "Search request canceled manually.",
                    category: "RECEIVING",
                    createdDate: new Date(COMMON.getCurrentUTC()),
                    action: "I"
                }]
            };
            break;
        case 578:
            msgobj = {
                messageBuildNumber: 579,
                developer: "Dharmishtha",
                message: [{
                    messageCode: "GLB20023",
                    messageKey: "TEXT_EDITOR_CONFIGURATION_MISSING",
                    messageType: "Error",
                    message: "System configuration is missing for text editor. Please contact to administrator/developer.",
                    category: "RECEIVING",
                    createdDate: new Date(COMMON.getCurrentUTC()),
                    action: "D"
                }]
            };
            break;
        case 579:
            msgobj = {
                messageBuildNumber: 580,
                developer: "Dharmishtha",
                message: [{
                    messageCode: "RCV20088",
                    messageKey: "INVOICE_CREATED_AGAINST_PACKING_SLIP",
                    messageType: "Error",
                    message: "You cannot change detail of packing slip# <b>{0}</b>, as Invoice is created against it.",
                    category: "RECEIVING",
                    createdDate: new Date(COMMON.getCurrentUTC()),
                    action: "I"
                }]
            };
            break;
        case 580:
            msgobj = {
                messageBuildNumber: 581,
                developer: "Dharmishtha",
                message: [{
                    messageCode: "GLB20033",
                    messageKey: "SSL_REQUIRED",
                    messageType: "Error",
                    message: "Invalid URL. Please enter URL contains <b>https://</b>.",
                    category: "GLOBAL",
                    createdDate: new Date(COMMON.getCurrentUTC()),
                    action: "I"
                }]
            };
            break;
        case 581:
            msgobj = {
                messageBuildNumber: 582,
                developer: "Dharmishtha",
                message: [{
                    messageCode: "GLB20023",
                    messageKey: "TEXT_EDITOR_CONFIGURATION_MISSING",
                    messageType: "Error",
                    message: "System configuration is missing for text editor. Please contact to administrator/developer.",
                    category: "GLOBAL",
                    createdDate: new Date(COMMON.getCurrentUTC()),
                    action: "I"
                }]
            };
            break;
        case 582:
            msgobj = {
                messageBuildNumber: 583,
                developer: "Fenil",
                message: [{
                    messageCode: "RCV20007",
                    messageKey: "BOM_LINE_NOT_CLEAN",
                    messageType: "Error",
                    message: "Assembly <b>{0}'s</b> BOM line# <b>{1}</b> part(s) are not clean or part are not Engineering Approved yet. Please clean line level issue to allocate material.",
                    category: "RECEIVING",
                    createdDate: new Date(COMMON.getCurrentUTC()),
                    action: "U"
                }]
            };
            break;
        case 583:
            msgobj = {
                messageBuildNumber: 584,
                developer: "Vaibhav",
                message: [{
                    messageCode: "MFG40006",
                    messageKey: "CONFIRM_BEFORE_RESET_SERIAL",
                    messageType: "Confirmation",
                    message: "All {0} will be reset. Are you sure? Press Yes to continue ?",
                    category: "MFG",
                    createdDate: new Date(COMMON.getCurrentUTC()),
                    action: "I"
                }]
            };
            break;
        case 584:
            msgobj = {
                messageBuildNumber: 585,
                developer: "Shweta",
                message: [{
                    messageCode: "MST10058",
                    messageKey: "EQUIPMENT_MAINTENANCE_SAVED",
                    messageType: "Success",
                    message: "Equipment maintenance saved successfully.",
                    category: "MASTER",
                    createdDate: new Date(COMMON.getCurrentUTC()),
                    action: "I"
                }]
            };
            break;
        case 585:
            msgobj = {
                messageBuildNumber: 586,
                developer: "Shweta",
                message: [{
                    messageCode: "MST20049",
                    messageKey: "EQUIPMENT_MAINTENANCE_NOT_SAVED",
                    messageType: "Error",
                    message: "Equipment maintenance could not be saved.",
                    category: "MASTER",
                    createdDate: new Date(COMMON.getCurrentUTC()),
                    action: "I"
                }]
            };
            break;
        case 586:
            msgobj = {
                messageBuildNumber: 587,
                developer: "Shweta",
                message: [{
                    messageCode: "MST10059",
                    messageKey: "EQUIPMENT_DATAELEMENT_CREATED",
                    messageType: "Success",
                    message: "Data field added to equipment.",
                    category: "MASTER",
                    createdDate: new Date(COMMON.getCurrentUTC()),
                    action: "I"
                }]
            };
            break;
        case 587:
            msgobj = {
                messageBuildNumber: 588,
                developer: "Shweta",
                message: [{
                    messageCode: "MST10060",
                    messageKey: "EQUIPMENT_DATAELEMENT_DELETED",
                    messageType: "Success",
                    message: "Data field removed from equipment.",
                    category: "MASTER",
                    createdDate: new Date(COMMON.getCurrentUTC()),
                    action: "I"
                }]
            };
            break;
        case 588:
            msgobj = {
                messageBuildNumber: 589,
                developer: "Shweta",
                message: [{
                    messageCode: "MST30011",
                    messageKey: "EQUIPMENT_IN_USE",
                    messageType: "Warning",
                    message: "Name should not be change, because it is in use.",
                    category: "MASTER",
                    createdDate: new Date(COMMON.getCurrentUTC()),
                    action: "I"
                }]
            };
            break;
        case 589:
            msgobj = {
                messageBuildNumber: 590,
                developer: "Dharmesh",
                message: [{
                    messageCode: "GLB10013",
                    messageKey: "HALT_RESUME_SUCCESSFUL",
                    messageType: "Error",
                    message: "{0} {1} successfully.",
                    category: "GLOBAL",
                    createdDate: new Date(COMMON.getCurrentUTC()),
                    action: "I"
                }]
            };
            break;


        case 590:
            msgobj = {
                messageBuildNumber: 591,
                developer: "Dharmesh",
                message: [{
                    messageCode: "RCV20086",
                    messageKey: "ALREADY_HOLDRESUME",
                    messageType: "Error",
                    category: "RECEIVING",
                    deletedDate: new Date(COMMON.getCurrentUTC()),
                    action: "D"
                }]
            };
            break;

        case 591:
            msgobj = {
                messageBuildNumber: 592,
                developer: "Dharmesh",
                message: [{
                    messageCode: "GLB20034",
                    messageKey: "ALREADY_HOLDRESUME",
                    messageType: "Error",
                    message: "{0} is already {1} by <b>{2}</b>.",
                    category: "GLOBAL",
                    createdDate: new Date(COMMON.getCurrentUTC()),
                    action: "I"


                }]
            };
            break;
        case 592:
            msgobj = {
                messageBuildNumber: 593,
                developer: "Vaibhav",
                message: [{
                    messageCode: "MFG50013",
                    messageKey: "FIRST_TRANSACTION_INFORMATION",
                    messageType: "Information",
                    message: "Note: Following configuration will not change once you start production, Please review before start activity.",
                    category: "MFG",
                    createdDate: new Date(COMMON.getCurrentUTC()),
                    action: "I"
                }]
            };
            break;
        case 593:
            msgobj = {
                messageBuildNumber: 594,
                developer: "Vaibhav",
                message: [{
                    messageCode: "MFG50014",
                    messageKey: "LOOP_OPERATION_PASS_QTY_INFORMATION",
                    messageType: "Information",
                    message: "Note: This activity is Loop Operation. Qty will pass to the previous operation.",
                    category: "MFG",
                    createdDate: new Date(COMMON.getCurrentUTC()),
                    action: "I"
                }]
            };
            break;
        case 594:
            msgobj = {
                messageBuildNumber: 595,
                developer: "Shweta",
                message: [{
                    messageCode: "GLB40018",
                    messageKey: "COMMON_DELETE_CONFIRMATION",
                    messageType: "Confirmation",
                    message: "{0} will be removed. Press Yes to Continue.",
                    category: "GLOBAL",
                    createdDate: new Date(COMMON.getCurrentUTC()),
                    action: "U"
                }]
            };
            break;
        case 595:
            msgobj = {
                messageBuildNumber: 596,
                developer: "Shweta",
                message: [{
                    messageCode: "GLB40005",
                    messageKey: "REMOVE_SINGLE_CONFIRM_MESSAGE",
                    messageType: "Confirmation",
                    message: "Selected {0} details will be removed.Press Yes to Continue.",
                    category: "GLOBAL",
                    createdDate: new Date(COMMON.getCurrentUTC()),
                    action: "U"
                }]
            };
            break;
        case 596:
            msgobj = {
                messageBuildNumber: 597,
                developer: "Ketan",
                message: [{
                    messageCode: "GLB10012",
                    messageKey: "FILE_FOLDER_REMOVE",
                    messageType: "Success",
                    message: "{0} removed successfully.",
                    category: "GLOBAL",
                    createdDate: new Date(COMMON.getCurrentUTC()),
                    action: "U"
                }]
            };
            break;
        case 597:
            msgobj = {
                messageBuildNumber: 598,
                developer: "Dharmishtha",
                message: [{
                    messageCode: "RCV20080",
                    messageKey: "LESS_QTY_OF_PART_MFR",
                    messageType: "Error",
                    message: "Entered count quantity is mismatched with the package quantity of part <b>{0}({1})</b> which is configured in Part Master. Please correct count quantity or select packaging other than Tape & Reel.",
                    category: "RECEIVING",
                    createdDate: new Date(COMMON.getCurrentUTC()),
                    action: "U"
                }]
            };
            break;
        case 598:
            msgobj = {
                messageBuildNumber: 599,
                developer: "Shirish",
                message: [{
                    messageCode: "MST40011",
                    messageKey: "CHANGE_PERMISSION_LOGOUT",
                    messageType: "Confirmation",
                    message: "You require to re-login in all active sessions to get changes in permission(s). Click \"Continue\" to continue work or click \"Logout\" to logout from all session.",
                    category: "MASTER",
                    modifiedDate: new Date(COMMON.getCurrentUTC()),
                    action: "U"
                }]
            };
            break;
        case 599:
            msgobj = {
                messageBuildNumber: 600,
                developer: "Shirish",
                message: [{
                    messageCode: "MST40012",
                    messageKey: "CHANGE_PERMISSION_SEND_NOTIFICATION",
                    messageType: "Confirmation",
                    message: "Personnel is required to re-login in all active sessions. Click \"Continue\" to continue without notify personnel or click \"Save & send notification\" to save and notify the personnel.",
                    category: "MASTER",
                    modifiedDate: new Date(COMMON.getCurrentUTC()),
                    action: "U"
                }]
            };
            break;
        case 600:
            msgobj = {
                messageBuildNumber: 601,
                developer: "Shirish",
                message: [{
                    messageCode: "MFG20013",
                    messageKey: "ADD_PROPER_DETAILS_TO_FILTER_FIRSTPICE_SERIALS",
                    messageType: "Error",
                    message: "Serial# is not scan yet, please scan serial# first.",
                    category: "MFG",
                    modifiedDate: new Date(COMMON.getCurrentUTC()),
                    action: "U"
                }]
            };
            break;
        case 601:
            msgobj = {
                messageBuildNumber: 602,
                developer: "Shirish",
                message: [{
                    messageCode: "MST40013",
                    messageKey: "WITHOUT_SAVING_ALERT_BODY_MESSAGE_FOR_ROLE",
                    messageType: "Confirmation",
                    message: "You will lose all unsaved changes for selected role.<br/> Are you sure you want to leave this role?",
                    category: "MASTER",
                    modifiedDate: new Date(COMMON.getCurrentUTC()),
                    action: "U"
                }]
            };
            break;
        case 602:
            msgobj = {
                messageBuildNumber: 603,
                developer: "Dharmesh",
                message: [{
                    messageCode: "RCV0023",
                    messageKey: "PO_KIT_ON_HOLD",
                    messageType: "Information",
                    message: "You cannot allocate UMID to kit, as PO or Kit Allocation for <b>PO# {0}, SO# {1}, AssyID {2}</b> is on hold.",
                    category: "RECEIVING",
                    modifiedDate: new Date(COMMON.getCurrentUTC()),
                    action: "U"
                }]
            };
            break;
        case 603:
            msgobj = {
                messageBuildNumber: 604,
                developer: "Champak",
                message: [{
                    messageCode: "MFG50006",
                    messageKey: "INVALID_QUANTITY",
                    messageType: "Information",
                    message: "Shipping qty does not match with PO qty.",
                    category: "MFG",
                    modifiedDate: new Date(COMMON.getCurrentUTC()),
                    action: "U"
                }]
            };
            break;
        case 604:
            msgobj = {
                messageBuildNumber: 605,
                developer: "Shweta",
                message: [{
                    messageCode: "MST10050",
                    messageKey: "PARTS_DELETED_FROM_OPERATION",
                    messageType: "Success",
                    message: "Supplies, Materials & Tools removed from operation.",
                    category: "MASTER",
                    createdDate: new Date(COMMON.getCurrentUTC()),
                    action: "I"
                }]
            };
            break;
        case 605:
            msgobj = {
                messageBuildNumber: 606,
                developer: "Shweta",
                message: [{
                    messageCode: "MST10049",
                    messageKey: "PARTS_ADDED_TO_OPERATION",
                    messageType: "Success",
                    message: "Supplies, Materials & Tools added to operation.",
                    category: "MASTER",
                    createdDate: new Date(COMMON.getCurrentUTC()),
                    action: "I"
                }]
            };
            break;
        case 606:
            msgobj = {
                messageBuildNumber: 607,
                developer: "Shweta",
                message: [{
                    messageCode: "MST10048",
                    messageKey: "EQUIPMENT_DELETED_FROM_OPERATION",
                    messageType: "Success",
                    message: "Equipment(s) removed from operation",
                    category: "MASTER",
                    createdDate: new Date(COMMON.getCurrentUTC()),
                    action: "I"
                }]
            };
            break;
        case 607:
            msgobj = {
                messageBuildNumber: 608,
                developer: "Shubham",
                message: [{
                    messageCode: "GLB20035",
                    messageKey: "NOT_PROCESS_SERIAL_NO_MESSAGE",
                    messageType: "Error",
                    message: "Due to following operation status of serial# not allowed to process following serial#.",
                    category: "GLOBAL",
                    modifiedDate: new Date(COMMON.getCurrentUTC()),
                    action: "I"
                }]
            };
            break;
        case 608:
            msgobj = {
                messageBuildNumber: 609,
                developer: "Shubham",
                message: [{
                    messageCode: "GLB20035",
                    messageKey: "NOT_PROCESS_SERIAL_NO_MESSAGE",
                    messageType: "Error",
                    message: "Due to the following operation status of serial# not allowed to process further.",
                    category: "GLOBAL",
                    modifiedDate: new Date(COMMON.getCurrentUTC()),
                    action: "U"
                }]
            };
            break;
        case 609:
            msgobj = {
                messageBuildNumber: 610,
                developer: "Shirish",
                message: [{
                    messageCode: "MST40010",
                    messageKey: "CONFIRMATION_FOR_DELETE_ROLE",
                    messageType: "Confirmation",
                    message: "Are you sure you want to remove {0} role from {1}?",
                    category: "MASTER",
                    modifiedDate: new Date(COMMON.getCurrentUTC()),
                    action: "U"
                }]
            };
            break;
        case 610:
            msgobj = {
                messageBuildNumber: 611,
                developer: "Shweta",
                message: [{
                    messageCode: "GLB20028",
                    messageKey: "TEXT_EDITOR_ACCEPT_VIDEO_IMAGE",
                    messageType: "Error",
                    message: "Only images and video files are allowed.",
                    category: "GLOBAL",
                    modifiedDate: new Date(COMMON.getCurrentUTC()),
                    action: "U"
                }]
            };
            break;
        case 611:
            msgobj = {
                messageBuildNumber: 612,
                developer: "Shweta",
                message: [{
                    messageCode: "MST20027",
                    messageKey: "AGREEMENT_NOT_PUBLISH",
                    messageType: "Error",
                    message: "Agreement could not be published.",
                    category: "MASTER",
                    modifiedDate: new Date(COMMON.getCurrentUTC()),
                    action: "U"
                }]
            };
            break;
        case 612:
            msgobj = {
                messageBuildNumber: 613,
                developer: "Fenil",
                message: [{
                    messageCode: "RCV20090",
                    messageKey: "KIt_RELEASE_CHANGE_MRP_KIT_QTY_NOT_GRETER",
                    messageType: "Error",
                    message: "Total of <b>Promised Ship Qty From PO</b> is greater then <b>PO Qty</b> or <b>Planned Kit & Planned Build Qty</b> is greater then <b>Kit Qty</b> respectively. <br />Please change <b>Promised Ship Qty From PO</b> and <b>Planned Kit & Planned Build Qty</b> from <b>Change Planing</b> pop-up.",
                    category: "RECEIVING",
                    createdDate: new Date(COMMON.getCurrentUTC()),
                    action: "I"
                }]
            };
            break;
        case 613:
            msgobj = {
                messageBuildNumber: 614,
                developer: "Fenil",
                message: [{
                    messageCode: "RCV20089",
                    messageKey: "KIT_RELEASE_DONE_MRP_KIT_QTY_NOT_CHANGE",
                    messageType: "Error",
                    message: "Kit was already released for this assembly. So, you cannot change MRP Qty or Kit Qty.",
                    category: "RECEIVING",
                    createdDate: new Date(COMMON.getCurrentUTC()),
                    action: "I"
                }]
            };
            break;
        case 614:
            msgobj = {
                messageBuildNumber: 615,
                developer: "Champak",
                message: [{
                    messageCode: "MFG50015",
                    messageKey: "INVALID_WORKORDERCODE",
                    messageType: "Information",
                    message: "Invalid WO#!",
                    category: "MFG",
                    createdDate: new Date(COMMON.getCurrentUTC()),
                    action: "I"
                }]
            };
            break;
        case 615:
            msgobj = {
                messageBuildNumber: 616,
                developer: "Champak",
                message: [{
                    messageCode: "MFG50016",
                    messageKey: "INVALID_OPERATIONCODE",
                    messageType: "Information",
                    message: "Invalid OP#!",
                    category: "MFG",
                    createdDate: new Date(COMMON.getCurrentUTC()),
                    action: "I"
                }]
            };
            break;
        case 616:
            msgobj = {
                messageBuildNumber: 617,
                developer: "Shubham",
                message: [{
                    messageCode: "MFG40001",
                    messageKey: "SERIAL_NUMBER_COUNT",
                    messageType: "Confirmation",
                    message: "Total <b>{0}</b> serial numbers will be generated from <b>{1}</b> to <b>{2}</b>. Are you sure? Press Yes to continue.",
                    category: "MFG",
                    createdDate: new Date(COMMON.getCurrentUTC()),
                    action: "U"
                }]
            };
            break;
        case 617:
            msgobj = {
                messageBuildNumber: 618,
                developer: "Shubham",
                message: [{
                    messageCode: "MFG40006",
                    messageKey: "CONFIRM_BEFORE_RESET_SERIAL",
                    messageType: "Confirmation",
                    message: "All {0} will be reset. Are you sure? Press Yes to continue.",
                    category: "MFG",
                    createdDate: new Date(COMMON.getCurrentUTC()),
                    action: "U"
                }]
            };
            break;
        case 618:
            msgobj = {
                messageBuildNumber: 619,
                developer: "Ashish",
                message: [{
                    messageCode: "MST50032",
                    messageKey: "SAMPLE_NOT_FOUND_FOR_REVISIONS",
                    messageType: "Information",
                    message: "Sample is not added for any revision(s) of this assembly/nickname.",
                    category: "MASTER",
                    createdDate: new Date(COMMON.getCurrentUTC()),
                    action: "I"
                }]
            };
            break;
        case 619:
            msgobj = {
                messageBuildNumber: 620,
                developer: "Ashish",
                message: [{
                    messageCode: "MST50031",
                    messageKey: "SAMPLE_NOT_FOUND_FOR_ASSEMBLY",
                    messageType: "Information",
                    message: "Sample is not added for this assembly.",
                    category: "MASTER",
                    createdDate: new Date(COMMON.getCurrentUTC()),
                    action: "I"
                }]
            };
            break;
        case 620:
            msgobj = {
                messageBuildNumber: 621,
                developer: "Ketan",
                message: [{
                    messageCode: "MFG50017",
                    messageKey: "NOT_ALLOWED_FOR_WOSTATUS",
                    messageType: "Information",
                    message: "Not allowed to change while work order status is in {0}.",
                    category: "MFG",
                    createdDate: new Date(COMMON.getCurrentUTC()),
                    action: "I"
                }]
            };
            break;
        case 621:
            msgobj = {
                messageBuildNumber: 622,
                developer: "Ketan",
                message: [{
                    messageCode: "MFG50017",
                    messageKey: "NOT_ALLOWED_FOR_WOSTATUS",
                    messageType: "Information",
                    message: "Not allowed to change information while work order status is {0}.",
                    category: "MFG",
                    createdDate: new Date(COMMON.getCurrentUTC()),
                    action: "U"
                }]
            };
            break;
        case 622:
            msgobj = {
                messageBuildNumber: 623,
                developer: "Ketan",
                message: [{
                    messageCode: "MFG50018",
                    messageKey: "NOT_ALLOWED_FOR_WO_OP_STATUS",
                    messageType: "Information",
                    message: "Not allowed to change information while operation status is {0}.",
                    category: "MFG",
                    createdDate: new Date(COMMON.getCurrentUTC()),
                    action: "I"
                }]
            };
            break;
        case 623:
            msgobj = {
                messageBuildNumber: 624,
                developer: "Shweta",
                message: [{
                    messageCode: "MST20050",
                    messageKey: "HELP_BLOG_EXISTS_VALIDATION",
                    messageType: "Error",
                    message: "Help blog already exists.",
                    category: "MASTER",
                    createdDate: new Date(COMMON.getCurrentUTC()),
                    action: "I"
                }]
            };
            break;
        case 624:
            msgobj = {
                messageBuildNumber: 625,
                developer: "Shweta",
                message: [{
                    messageCode: "MST10064",
                    messageKey: "HELP_BLOG_PUBLISH_SUCCESS",
                    messageType: "Success",
                    message: "Help Blog is published successfully.",
                    category: "MASTER",
                    createdDate: new Date(COMMON.getCurrentUTC()),
                    action: "I"
                }]
            };
            break;
        case 625:
            msgobj = {
                messageBuildNumber: 626,
                developer: "Shweta",
                message: [{
                    messageCode: "MST20051",
                    messageKey: "HELP_BLOG_NOT_PUBLISH",
                    messageType: "Error",
                    message: "Help Blog could not be published.",
                    category: "MASTER",
                    createdDate: new Date(COMMON.getCurrentUTC()),
                    action: "I"
                }]
            };
            break;
        case 626:
            msgobj = {
                messageBuildNumber: 627,
                developer: "Shweta",
                message: [{
                    messageCode: "MST40025",
                    messageKey: "HELP_BLOG_PUBLISH_CONFIRM",
                    messageType: "Confirmation",
                    message: "Are you sure?  This action will publish current blog and previous blog will be set as read only. Press Yes to Continue. <br/> Note: You won't be able rollback this action, make sure blog is ready to publish.",
                    category: "MASTER",
                    createdDate: new Date(COMMON.getCurrentUTC()),
                    action: "I"
                }]
            };
            break;
        case 627:
            msgobj = {
                messageBuildNumber: 628,
                developer: "Shweta",
                message: [{
                    messageCode: "MST40026",
                    messageKey: "ADD_TRANSACTION_CONFIRM_MESSAGE",
                    messageType: "Confirmation",
                    message: "Selected {0} entity/entities will be added into enterprise search database. Press Yes to Continue.",
                    category: "MASTER",
                    createdDate: new Date(COMMON.getCurrentUTC()),
                    action: "I"
                }]
            };
            break;
        case 628:
            msgobj = {
                messageBuildNumber: 629,
                developer: "Shweta",
                message: [{
                    messageCode: "MST40027",
                    messageKey: "REMOVE_TRANSACTION_CONFIRM_MESSAGE",
                    messageType: "Confirmation",
                    message: "Selected {0} entity/entities will be removed from enterprise search database. Press Yes to Continue.",
                    category: "MASTER",
                    createdDate: new Date(COMMON.getCurrentUTC()),
                    action: "I"
                }]
            };
            break;
        case 629:
            msgobj = {
                messageBuildNumber: 630,
                developer: "Shweta",
                message: [{
                    messageCode: "MST20052",
                    messageKey: "NOT_MOVE_BETWEEN_DATA_SOURCE_SELECTION",
                    messageType: "Error",
                    message: "You are not allowed to update {0}. Reference transactions may exist for selected option!",
                    category: "MASTER",
                    createdDate: new Date(COMMON.getCurrentUTC()),
                    action: "I"
                }]
            };
            break;
        case 630:
            msgobj = {
                messageBuildNumber: 631,
                developer: "Shweta",
                message: [{
                    messageCode: "GLB10014",
                    messageKey: "EMPLOYEE_ADDED_TO_ACCESS",
                    messageType: "Success",
                    message: "Personnel assigned to {0}.",
                    category: "GLOBAL",
                    createdDate: new Date(COMMON.getCurrentUTC()),
                    action: "I"
                }]
            };
            break;
        case 631:
            msgobj = {
                messageBuildNumber: 632,
                developer: "Shweta",
                message: [{
                    messageCode: "GLB10015",
                    messageKey: "EMPLOYEE_DELETED_FROM_ACCESS",
                    messageType: "Success",
                    message: "Personnel removed from {0}.",
                    category: "GLOBAL",
                    createdDate: new Date(COMMON.getCurrentUTC()),
                    action: "I"
                }]
            };
            break;
        case 632:
            msgobj = {
                messageBuildNumber: 633,
                developer: "Shweta",
                message: [{
                    messageCode: "MST40028",
                    messageKey: "WITHOUT_SAVING_ELEMENT_ALERT_BODY_MESSAGE",
                    messageType: "Confirmation",
                    message: "You will lose all unsaved changes for selected element.<br/> Are you sure you want to move on new element?",
                    category: "MASTER",
                    createdDate: new Date(COMMON.getCurrentUTC()),
                    action: "I"
                }]
            };
            break;
        case 633:
            msgobj = {
                messageBuildNumber: 634,
                developer: "Shweta",
                message: [{
                    messageCode: "GLB20036",
                    messageKey: "INVALID_VALUE",
                    messageType: "Error",
                    message: "Invalid Value !",
                    category: "GLOBAL",
                    createdDate: new Date(COMMON.getCurrentUTC()),
                    action: "I"
                }]
            };
            break;
        case 634:
            msgobj = {
                messageBuildNumber: 635,
                developer: "Shweta",
                message: [{
                    messageCode: "MST20054",
                    messageKey: "SUBFORM_NOT_EDIT_MESSAGE",
                    messageType: "Error",
                    message: "Subform transaction records exists, please remove those data first.",
                    category: "MASTER",
                    createdDate: new Date(COMMON.getCurrentUTC()),
                    action: "I"
                }]
            };
            break;
        case 635:
            msgobj = {
                messageBuildNumber: 636,
                developer: "Shweta",
                message: [{
                    messageCode: "MST20055",
                    messageKey: "UNIQUE_DISPLAY_VALUE",
                    messageType: "Error",
                    message: "Display value already exists.",
                    category: "MASTER",
                    createdDate: new Date(COMMON.getCurrentUTC()),
                    action: "I"
                }]
            };
            break;
        case 636:
            msgobj = {
                messageBuildNumber: 637,
                developer: "Shweta",
                message: [{
                    messageCode: "MST20056",
                    messageKey: "ADD_ELEMENT_FIRST",
                    messageType: "Error",
                    message: "No element added yet. Please add element first.",
                    category: "MASTER",
                    createdDate: new Date(COMMON.getCurrentUTC()),
                    action: "I"
                }]
            };
            break;
        case 637:
            msgobj = {
                messageBuildNumber: 638,
                developer: "Shweta",
                message: [{
                    messageCode: "MST20057",
                    messageKey: "DATAELEMENT_TRANSACTIONVALUES_UNIQUE",
                    messageType: "Error",
                    message: "{0} field value must be unique.",
                    category: "MASTER",
                    createdDate: new Date(COMMON.getCurrentUTC()),
                    action: "I"
                }]
            };
            break;
        case 638:
            msgobj = {
                messageBuildNumber: 639,
                developer: "Shweta",
                message: [{
                    messageCode: "MST20058",
                    messageKey: "DOCUMENT_NOT_FOUND",
                    messageType: "Error",
                    message: "Document is not found.",
                    category: "MASTER",
                    createdDate: new Date(COMMON.getCurrentUTC()),
                    action: "I"
                }]
            };
            break;
        case 639:
            msgobj = {
                messageBuildNumber: 640,
                developer: "Ashish",
                message: [{
                    messageCode: "MFG20016",
                    messageKey: "OPENING_STOCK_ENTRY_ALREADY_EXISTS",
                    messageType: "Error",
                    message: "Opening entry already exists for Assy ID <b>{0}</b> and Wo# <b>{1}</b>.",
                    category: "MFG",
                    createdDate: new Date(COMMON.getCurrentUTC()),
                    action: "I"
                }]
            };
            break;
        case 640:
            msgobj = {
                messageBuildNumber: 641,
                developer: "Ashish",
                message: [{
                    messageCode: "MFG20017",
                    messageKey: "OPENING_STOCK_MUST_BE_GREATER_THAN_ZERO",
                    messageType: "Error",
                    message: "Opening stock must be grater than zero.",
                    category: "MFG",
                    createdDate: new Date(COMMON.getCurrentUTC()),
                    action: "I"
                }]
            };
            break;
        case 641:
            msgobj = {
                messageBuildNumber: 642,
                developer: "Fenil",
                message: [{
                    messageCode: "RCV20091",
                    messageKey: "PERMANENT_BIN_NOT_TRANSFER",
                    messageType: "Error",
                    message: "Bin <b>{0}</b> is permanent bin. So, you cannot transfer the bin.",
                    category: "RECEIVING",
                    createdDate: new Date(COMMON.getCurrentUTC()),
                    action: "I"
                }]
            };
            break;
        case 642:
            msgobj = {
                messageBuildNumber: 643,
                developer: "Fenil",
                message: [{
                    messageCode: "RCV20092",
                    messageKey: "OTHER_THAN_SHELVING_CART_NOT_TRANSFER",
                    messageType: "Error",
                    message: "Warehouse <b>{0}</b> is not <b>Shelving Cart</b>. So, you cannot transfer the bin.",
                    category: "RECEIVING",
                    createdDate: new Date(COMMON.getCurrentUTC()),
                    action: "I"
                }]
            };
            break;
        case 643:
            msgobj = {
                messageBuildNumber: 644,
                developer: "Fenil",
                message: [{
                    messageCode: "RCV20093",
                    messageKey: "SCAN_VALID_WAREHOUSE",
                    messageType: "Error",
                    message: "Please enter or scan valid warehouse.",
                    category: "RECEIVING",
                    createdDate: new Date(COMMON.getCurrentUTC()),
                    action: "I"
                }]
            };
            break;
        case 644:
            msgobj = {
                messageBuildNumber: 645,
                developer: "Fenil",
                message: [{
                    messageCode: "RCV20094",
                    messageKey: "BIN_ALREADY_IN_WAREHOUSE",
                    messageType: "Error",
                    message: "Bin <b>{0}</b> already contain in warehouse <b>{1}</b>. So, you cannot transfer the bin.",
                    category: "RECEIVING",
                    createdDate: new Date(COMMON.getCurrentUTC()),
                    action: "I"
                }]
            };
            break;
        case 645:
            msgobj = {
                messageBuildNumber: 646,
                developer: "Fenil",
                message: [{
                    messageCode: "RCV20095",
                    messageKey: "DEPARTMENT_NOT_MATCH_BIN_NOT_TRANSFER",
                    messageType: "Error",
                    message: "From Bin <b>{0}</b> and To Warehouse <b>{1}</b>'s department does not same. So, you cannot transfer the bin.",
                    category: "RECEIVING",
                    createdDate: new Date(COMMON.getCurrentUTC()),
                    action: "I"
                }]
            };
            break;
        case 646:
            msgobj = {
                messageBuildNumber: 647,
                developer: "Fenil",
                message: [{
                    messageCode: "RCV20096",
                    messageKey: "NOT_TRANSFER_PENDING_UMID_PART_BIN",
                    messageType: "Error",
                    message: "You cannot transfer bin <b>{0}</b>, as it contains pending UMID parts.",
                    category: "RECEIVING",
                    createdDate: new Date(COMMON.getCurrentUTC()),
                    action: "I"
                }]
            };
            break;
        case 647:
            msgobj = {
                messageBuildNumber: 648,
                developer: "Fenil",
                message: [{
                    messageCode: "RCV20097",
                    messageKey: "NOT_TRANSFER_PENDING_UMID_ALLOCATION",
                    messageType: "Error",
                    message: "You cannot transfer bin <b>{0}</b>, as it contains some UMID which is not allocate.",
                    category: "RECEIVING",
                    createdDate: new Date(COMMON.getCurrentUTC()),
                    action: "I"
                }]
            };
            break;
        case 648:
            msgobj = {
                messageBuildNumber: 649,
                developer: "Ashish",
                message: [{
                    messageCode: "MFG20016",
                    messageKey: "OPENING_STOCK_ENTRY_ALREADY_EXISTS",
                    messageType: "Error",
                    message: "Opening entry already exists for Assy ID <b>{0}<\b> and WO# <b>{1}<\b>.",
                    category: "MFG",
                    modifiedDate: new Date(COMMON.getCurrentUTC()),
                    action: "U"
                }]
            };
            break;
        case 649:
            msgobj = {
                messageBuildNumber: 650,
                developer: "Shirish",
                message: [{
                    messageCode: "RFQ40004",
                    messageKey: "COPY_RFQ_CONFIRMATION",
                    messageType: "Confirmation",
                    message: "Are you sure want to copy RFQ in {0} quote group.",
                    category: "RFQ",
                    modifiedDate: new Date(COMMON.getCurrentUTC()),
                    action: "I"
                }]
            };
            break;
        case 650:
            msgobj = {
                messageBuildNumber: 651,
                developer: "Shirish",
                message: [{
                    messageCode: "RFQ10001",
                    messageKey: "RFQ_COPIED",
                    messageType: "Success",
                    message: "RFQ copied successfully.",
                    category: "RFQ",
                    modifiedDate: new Date(COMMON.getCurrentUTC()),
                    action: "I"
                }]
            };
            break;
        case 651:
            msgobj = {
                messageBuildNumber: 652,
                developer: "Shirish",
                message: [{
                    messageCode: "RFQ20005",
                    messageKey: "NOT_ALLOW_FOR_COPY",
                    messageType: "Error",
                    message: "Selected Assy {0} is used in Sub Assy of Copy Assy {1}. Please review.",
                    category: "RFQ",
                    modifiedDate: new Date(COMMON.getCurrentUTC()),
                    action: "I"
                }]
            };
            break;
        case 652:
            msgobj = {
                messageBuildNumber: 653,
                developer: "Shirish",
                message: [{
                    messageCode: "RFQ10002",
                    messageKey: "BOM_COPIED",
                    messageType: "Success",
                    message: "BOM copied successfully.",
                    category: "RFQ",
                    modifiedDate: new Date(COMMON.getCurrentUTC()),
                    action: "I"
                }]
            };
            break;
        case 653:
            msgobj = {
                messageBuildNumber: 654,
                developer: "Shweta",
                message: [{
                    messageCode: "RCV20098",
                    messageKey: "PURCHASE_PART_DUPLICATE",
                    messageType: "Error",
                    message: "Purchase Part entry already exists.",
                    category: "RECEIVING",
                    createdDate: new Date(COMMON.getCurrentUTC()),
                    action: "I"
                }]
            };
            break;
        case 654:
            msgobj = {
                messageBuildNumber: 655,
                developer: "Shweta",
                message: [{
                    messageCode: "RCV20099",
                    messageKey: "PURCHASE_PART_PO_NUMBER_DUPLICATE",
                    messageType: "Error",
                    message: "PO# <b>{0}</b> belongs to PO date <b>{1}</b>, please correct.",
                    category: "RECEIVING",
                    createdDate: new Date(COMMON.getCurrentUTC()),
                    action: "I"
                }]
            };
            break;
        case 655:
            msgobj = {
                messageBuildNumber: 656,
                developer: "Shweta",
                message: [{
                    messageCode: "RCV20100",
                    messageKey: "SHIPPED_INVALID_QTY",
                    messageType: "Error",
                    message: "Shipped quantity is invalid!",
                    category: "RECEIVING",
                    createdDate: new Date(COMMON.getCurrentUTC()),
                    action: "I"
                }]
            };
            break;
        case 656:
            msgobj = {
                messageBuildNumber: 657,
                developer: "Shweta",
                message: [{
                    messageCode: "RCV20101",
                    messageKey: "DEFAULT_COMPNAY_BILL_ADDRESS_MISSING",
                    messageType: "Error",
                    message: "Please add billing address details for default company.",
                    category: "RECEIVING",
                    createdDate: new Date(COMMON.getCurrentUTC()),
                    action: "I"
                }]
            };
            break;
        case 657:
            msgobj = {
                messageBuildNumber: 658,
                developer: "Shweta",
                message: [{
                    messageCode: "RCV20102",
                    messageKey: "CUST_SHIP_ADDRESS_MISSING",
                    messageType: "Error",
                    message: "Please add billing address details for default company.",
                    category: "RECEIVING",
                    createdDate: new Date(COMMON.getCurrentUTC()),
                    action: "I"
                }]
            };
            break;
        case 658:
            msgobj = {
                messageBuildNumber: 659,
                developer: "Shweta",
                message: [{
                    messageCode: "RCV20103",
                    messageKey: "SHIP_ADDRESS_COUNTRY_MISMATCH",
                    messageType: "Error",
                    message: "Shipping not allowed as export controlled assemblies/parts exists.",
                    category: "RECEIVING",
                    createdDate: new Date(COMMON.getCurrentUTC()),
                    action: "I"
                }]
            };
            break;
        case 659:
            msgobj = {
                messageBuildNumber: 660,
                developer: "Shirish",
                message: [{
                    messageCode: "RFQ40005",
                    messageKey: "RFQ_LAST_ASSY_REMOVE_MSG",
                    messageType: "Confirmation",
                    message: "RFQ will be deleted, Are you sure to remove assembly?",
                    category: "RFQ",
                    modifiedDate: new Date(COMMON.getCurrentUTC()),
                    action: "I"
                }]
            };
            break;
        case 660:
            msgobj = {
                messageBuildNumber: 661,
                developer: "Shirish",
                message: [{
                    messageCode: "RFQ40006",
                    messageKey: "RFQ_ASSY_REMOVE_MSG",
                    messageType: "Confirmation",
                    message: "Are you sure to remove assembly?",
                    category: "RFQ",
                    modifiedDate: new Date(COMMON.getCurrentUTC()),
                    action: "I"
                }]
            };
            break;
        case 661:
            msgobj = {
                messageBuildNumber: 662,
                developer: "Shirish",
                message: [{
                    messageCode: "RFQ40007",
                    messageKey: "JOBTYPE_CHANGE_MESSAGE",
                    messageType: "Confirmation",
                    message: "Current pricing and labor costing will affect due to change in job type for following assembly.",
                    category: "RFQ",
                    modifiedDate: new Date(COMMON.getCurrentUTC()),
                    action: "I"
                }]
            };
            break;
        case 662:
            msgobj = {
                messageBuildNumber: 663,
                developer: "Shirish",
                message: [{
                    messageCode: "RFQ40008",
                    messageKey: "PRICING_REMOVE_ON_QTY_CHANGE",
                    messageType: "Confirmation",
                    message: "Current pricing will be change due to change in quantity for following Assembly.",
                    category: "RFQ",
                    modifiedDate: new Date(COMMON.getCurrentUTC()),
                    action: "I"
                }]
            };
            break;
        case 663:
            msgobj = {
                messageBuildNumber: 664,
                developer: "Shirish",
                message: [{
                    messageCode: "RFQ50001",
                    messageKey: "RFQ_DELETE_MESSAGE",
                    messageType: "Information",
                    message: "Part Costing has been started for {0} RFQ Assembly. You cannot delete it.<br/>To Cancel it, You have to submit Quote and cancel RFQ assembly.",
                    category: "RFQ",
                    modifiedDate: new Date(COMMON.getCurrentUTC()),
                    action: "I"
                }]
            };
            break;
        case 664:
            msgobj = {
                messageBuildNumber: 665,
                developer: "Shirish",
                message: [{
                    messageCode: "RFQ50002",
                    messageKey: "FILL_ASSY_DETAIL",
                    messageType: "Information",
                    message: "In prior to add assembly you must have to fill up all required detail of RFQ assembly.<br> Please fill up '{0}' required detail.",
                    category: "RFQ",
                    modifiedDate: new Date(COMMON.getCurrentUTC()),
                    action: "I"
                }]
            };
            break;
        case 665:
            msgobj = {
                messageBuildNumber: 666,
                developer: "Shirish",
                message: [{
                    messageCode: "RFQ50003",
                    messageKey: "SAME_QUANTITY_EXISTS",
                    messageType: "Information",
                    message: "Same quantity for 'Assembly {0}' is already exists.",
                    category: "RFQ",
                    modifiedDate: new Date(COMMON.getCurrentUTC()),
                    action: "I"
                }]
            };
            break;
        case 666:
            msgobj = {
                messageBuildNumber: 667,
                developer: "Shirish",
                message: [{
                    messageCode: "RFQ50004",
                    messageKey: "SAME_ASSY_EXISTS",
                    messageType: "Information",
                    message: "Same assembly '{0}' is already exists in current RFQ.",
                    category: "RFQ",
                    modifiedDate: new Date(COMMON.getCurrentUTC()),
                    action: "I"
                }]
            };
            break;
        case 667:
            msgobj = {
                messageBuildNumber: 668,
                developer: "Shirish",
                message: [{
                    messageCode: "RFQ50005",
                    messageKey: "SAME_ASSY_EXISTS_API",
                    messageType: "Information",
                    message: "Same assembly '{0}' is already exists in current RFQ. Please reload page for get latest updates.",
                    category: "RFQ",
                    modifiedDate: new Date(COMMON.getCurrentUTC()),
                    action: "I"
                }]
            };
            break;
        case 668:
            msgobj = {
                messageBuildNumber: 669,
                developer: "Shirish",
                message: [{
                    messageCode: "RFQ50006",
                    messageKey: "RFQ_DELETE_MESSAGE_API",
                    messageType: "Information",
                    message: "Part costing has been started for RFQ assembly. You cannot delete it.",
                    category: "RFQ",
                    modifiedDate: new Date(COMMON.getCurrentUTC()),
                    action: "I"
                }]
            };
            break;
        case 669:
            msgobj = {
                messageBuildNumber: 670,
                developer: "Shirish",
                message: [{
                    messageCode: "RFQ10003",
                    messageKey: "PLANNED_BOM_SAVED",
                    messageType: "Success",
                    message: "BOM submitted successfully for part costing & labor cost.",
                    category: "RFQ",
                    modifiedDate: new Date(COMMON.getCurrentUTC()),
                    action: "I"
                }]
            };
            break;
        case 670:
            msgobj = {
                messageBuildNumber: 671,
                developer: "Shirish",
                message: [{
                    messageCode: "RFQ10004",
                    messageKey: "BOM_SAVED",
                    messageType: "Success",
                    message: "BOM saved successfully.",
                    category: "RFQ",
                    modifiedDate: new Date(COMMON.getCurrentUTC()),
                    action: "I"
                }]
            };
            break;
        case 671:
            msgobj = {
                messageBuildNumber: 672,
                developer: "Shirish",
                message: [{
                    messageCode: "RFQ40009",
                    messageKey: "VERIFY_BOM_PRICING_CONFIRMATION_MSG",
                    messageType: "Confirmation",
                    message: "Last pricing will be lost for updated line items. Press Yes to Continue.",
                    category: "RFQ",
                    modifiedDate: new Date(COMMON.getCurrentUTC()),
                    action: "I"
                }]
            };
            break;
        case 672:
            msgobj = {
                messageBuildNumber: 673,
                developer: "Shirish",
                message: [{
                    messageCode: "RFQ40010",
                    messageKey: "VERIFY_BOM_PRICING_CONFIRMATION_MSG_INITIAL",
                    messageType: "Confirmation",
                    message: "Are you ready to get pricing?",
                    category: "RFQ",
                    modifiedDate: new Date(COMMON.getCurrentUTC()),
                    action: "I"
                }]
            };
            break;
        case 673:
            msgobj = {
                messageBuildNumber: 674,
                developer: "Shirish",
                message: [{
                    messageCode: "RFQ50007",
                    messageKey: "UOM_MISMATCH_TEXT",
                    messageType: "Information",
                    message: "To verify BOM, following line items should have same UOM.",
                    category: "RFQ",
                    modifiedDate: new Date(COMMON.getCurrentUTC()),
                    action: "I"
                }]
            };
            break;
        case 674:
            msgobj = {
                messageBuildNumber: 675,
                developer: "Dharmesh",
                message: [{
                    messageCode: "RCV10007",
                    messageKey: "INITIATE_KIT_RETURN_SUCCESS",
                    messageType: "Success",
                    message: "Initiate return request has been sent successfully.Your kit is ready to return.",
                    category: "RECEIVING",
                    modifiedDate: new Date(COMMON.getCurrentUTC()),
                    action: "I"
                }]
            };
            break;
        case 675:
            msgobj = {
                messageBuildNumber: 676,
                developer: "Dharmesh",
                message: [{
                    messageCode: "RCV50024",
                    messageKey: "INITIATE_KIT_RETURN_WO_STATUS_CHANGE",
                    messageType: "Information",
                    message: "To initiate return request for <b>WO# {0}</b>. The workorder status must be either completed or terminated.",
                    category: "RECEIVING",
                    modifiedDate: new Date(COMMON.getCurrentUTC()),
                    action: "I"
                }]
            };
            break;

        case 676:
            msgobj = {
                messageBuildNumber: 677,
                developer: "Dharmesh",
                message: [{
                    messageCode: "RCV40017",
                    messageKey: "FORCE_RETURN",
                    messageType: "Confirmation",
                    message: "Are you sure? You want to return this kit forcefully as WO is not assigned against <b>Plan# {0}</b>.",
                    category: "RECEIVING",
                    modifiedDate: new Date(COMMON.getCurrentUTC()),
                    action: "I"
                }]
            };
            break;
        case 677:
            msgobj = {
                messageBuildNumber: 678,
                developer: "Dharmesh",
                message: [{
                    messageCode: "RCV20001",
                    messageKey: "NOT_ALLOW_RETURN_KIT_FOR_ALLOCATED_UMID",
                    messageType: "Error",
                    message: "You cannot return this kit as <b>{0}</b> UMID is allocated to this kit. Please consume/deallocate the inventory from the kit prior to return.",
                    category: "RECEIVING",
                    modifiedDate: new Date(COMMON.getCurrentUTC()),
                    action: "U"
                }]
            };
            break;
        case 678:
            msgobj = {
                messageBuildNumber: 679,
                developer: "Dharmesh",
                message: [{
                    messageCode: "RCV40018",
                    messageKey: "INITIATE_KIT_RETURN_CONFIRMATION",
                    messageType: "Confirmation",
                    message: "Are you sure? You want to initiate kit return.",
                    category: "RECEIVING",
                    modifiedDate: new Date(COMMON.getCurrentUTC()),
                    action: "I"
                }]
            };
            break;
        case 679:
            msgobj = {
                messageBuildNumber: 680,
                developer: "Dharmesh",
                message: [{
                    messageCode: "RCV40019",
                    messageKey: "DEALLOCATE_CONFIRMATION",
                    messageType: "Confirmation",
                    message: "Are you sure? You want to deallocate selected UMID(s) from this kit.",
                    category: "RECEIVING",
                    modifiedDate: new Date(COMMON.getCurrentUTC()),
                    action: "I"
                }]
            };
            break;
        case 680:
            msgobj = {
                messageBuildNumber: 681,
                developer: "Shweta",
                message: [{
                    messageCode: "MST10065",
                    messageKey: "PIN_TO_DASHBOARD",
                    messageType: "Success",
                    message: "Widget is pinned to the dashboard.",
                    category: "MASTER",
                    createdDate: new Date(COMMON.getCurrentUTC()),
                    action: "I"
                }]
            };
            break;
        case 681:
            msgobj = {
                messageBuildNumber: 682,
                developer: "Shweta",
                message: [{
                    messageCode: "MST10066",
                    messageKey: "UNPIN_TO_DASHBOARD",
                    messageType: "Success",
                    message: "Widget is unpinned from the dashboard.",
                    category: "MASTER",
                    createdDate: new Date(COMMON.getCurrentUTC()),
                    action: "I"
                }]
            };
            break;
        case 682:
            msgobj = {
                messageBuildNumber: 683,
                developer: "Shweta",
                message: [{
                    messageCode: "MST10067",
                    messageKey: "EMPLOYEE_ADDED_TO_CHART",
                    messageType: "Success",
                    message: "Personnel assigned to widget.",
                    category: "MASTER",
                    createdDate: new Date(COMMON.getCurrentUTC()),
                    action: "I"
                }]
            };
            break;
        case 683:
            msgobj = {
                messageBuildNumber: 684,
                developer: "Shweta",
                message: [{
                    messageCode: "MST10068",
                    messageKey: "EMPLOYEE_DELETED_FROM_CHART",
                    messageType: "Success",
                    message: "Personnel removed from widget.",
                    category: "MASTER",
                    createdDate: new Date(COMMON.getCurrentUTC()),
                    action: "I"
                }]
            };
            break;
        case 684:
            msgobj = {
                messageBuildNumber: 685,
                developer: "Shweta",
                message: [{
                    messageCode: "MST20053",
                    messageKey: "WIDGET_DELETE_NOT_ALLOWED_CREATED_EMP",
                    messageType: "Error",
                    message: "Not allowed as selected user has created widget.",
                    category: "MASTER",
                    createdDate: new Date(COMMON.getCurrentUTC()),
                    action: "I"
                }]
            };
            break;
        case 685:
            msgobj = {
                messageBuildNumber: 686,
                developer: "Shweta",
                message: [{
                    messageCode: "GLB40020",
                    messageKey: "DELETE_CONFIRM_DETAILS_MESSAGE",
                    messageType: "Confirmation",
                    message: "{0} details will be removed from list. Press Yes to Continue.",
                    category: "GLOBAL",
                    createdDate: new Date(COMMON.getCurrentUTC()),
                    action: "I"
                }]
            };
            break;
        case 686:
            msgobj = {
                messageBuildNumber: 687,
                developer: "Shweta",
                message: [{
                    messageCode: "GLB20037",
                    messageKey: "DATAELEMENT_KEYVALUES_NOT_FOUND",
                    messageType: "Error",
                    message: "Data field key values are not Found.",
                    category: "GLOBAL",
                    createdDate: new Date(COMMON.getCurrentUTC()),
                    action: "I"
                }]
            };
            break;
        case 687:
            msgobj = {
                messageBuildNumber: 688,
                developer: "Shweta",
                message: [{
                    messageCode: "GLB20040",
                    messageKey: "DARKCOLOR",
                    messageType: "Error",
                    message: "Please select light color.",
                    category: "GLOBAL",
                    createdDate: new Date(COMMON.getCurrentUTC()),
                    action: "I"
                }]
            };
            break;
        case 688:
            msgobj = {
                messageBuildNumber: 689,
                developer: "Shweta",
                message: [{
                    messageCode: "GLB20041",
                    messageKey: "VALIDCOLOR",
                    messageType: "Error",
                    message: "Please select valid color.It is already in used.",
                    category: "GLOBAL",
                    createdDate: new Date(COMMON.getCurrentUTC()),
                    action: "I"
                }]
            };
            break;
        case 689:
            msgobj = {
                messageBuildNumber: 690,
                developer: "Shweta",
                message: [{
                    messageCode: "GLB20042",
                    messageKey: "MAPPING_ERROR",
                    messageType: "Error",
                    message: "Please map first.",
                    category: "GLOBAL",
                    createdDate: new Date(COMMON.getCurrentUTC()),
                    action: "I"
                }]
            };
            break;
        case 690:
            msgobj = {
                messageBuildNumber: 691,
                developer: "Champak",
                message: [{
                    messageCode: "MFG20018",
                    messageKey: "INCOMIG_VALIDATION",
                    messageType: "Error",
                    message: "Rack# {0} is empty. Empty rack cannot be assign as incoming rack#.",
                    category: "MFG",
                    createdDate: new Date(COMMON.getCurrentUTC()),
                    action: "I"
                }]
            };
            break;
        case 691:
            msgobj = {
                messageBuildNumber: 692,
                developer: "Champak",
                message: [{
                    messageCode: "MFG40007",
                    messageKey: "OUTGOING_CONFIRMATION",
                    messageType: "Confirmation",
                    message: "Rack# {0} is not allowed in current operation as incoming rack# because it is already assigned in {1} operation of workorder {2} as {3} by user {4}.",
                    category: "MFG",
                    createdDate: new Date(COMMON.getCurrentUTC()),
                    action: "I"
                }]
            };
            break;
        case 692:
            msgobj = {
                messageBuildNumber: 693,
                developer: "Ashish",
                message: [{
                    messageCode: "GLB20043",
                    messageKey: "DATE_RANGE_VALIDATION_MESSAGE",
                    messageType: "Error",
                    message: "Date range should not exceed {0} days.",
                    category: "GLOBAL",
                    createdDate: new Date(COMMON.getCurrentUTC()),
                    action: "I"
                }]
            };
            break;
        case 693:
            msgobj = {
                messageBuildNumber: 694,
                developer: "Champak",
                message: [{
                    messageCode: "MFG40008",
                    messageKey: "CLEAR_RACK_CONFIRM",
                    messageType: "Confirmation",
                    message: "Are you sure to clear {0} rack#? Press Yes to Continue.",
                    category: "MFG",
                    createdDate: new Date(COMMON.getCurrentUTC()),
                    action: "I"
                }]
            };
            break;
        case 694:
            msgobj = {
                messageBuildNumber: 695,
                developer: "Ketan",
                message: [{
                    messageCode: "GLB10016",
                    messageKey: "DOC_COPIED_TO_DESTINATION",
                    messageType: "Success",
                    message: "Document(s) copied to {0}.",
                    category: "GLOBAL",
                    createdDate: new Date(COMMON.getCurrentUTC()),
                    action: "I"
                }]
            };
            break;

        case 695:
            msgobj = {
                messageBuildNumber: 696,
                developer: "Shirish",
                message: [{
                    messageCode: "RFQ50008",
                    messageKey: "SIMILAR_PRICE_GROUP_EXISTS",
                    messageType: "Information",
                    message: "Price group with similar assembly quantity detail is already exists.",
                    category: "RFQ",
                    modifiedDate: new Date(COMMON.getCurrentUTC()),
                    action: "I"
                }]
            };
            break;
        case 696:
            msgobj = {
                messageBuildNumber: 697,
                developer: "Shirish",
                message: [{
                    messageCode: "RFQ40011",
                    messageKey: "RFQ_PRICE_GROUP_REMOVE_MSG",
                    messageType: "Confirmation",
                    message: "Are you sure to remove Price Group?",
                    category: "RFQ",
                    modifiedDate: new Date(COMMON.getCurrentUTC()),
                    action: "I"
                }]
            };
            break;
        case 697:
            msgobj = {
                messageBuildNumber: 698,
                developer: "Shirish",
                message: [{
                    messageCode: "RFQ50009",
                    messageKey: "RFQ_ASSY_DOES_NOT_EXISTS",
                    messageType: "Information",
                    message: "Following assembly does not existing in current quote group.",
                    category: "RFQ",
                    modifiedDate: new Date(COMMON.getCurrentUTC()),
                    action: "I"
                }]
            };
            break;
        case 698:
            msgobj = {
                messageBuildNumber: 699,
                developer: "Shirish",
                message: [{
                    messageCode: "RFQ50010",
                    messageKey: "IMPORT_PRICE_GROUP_WITHOUT_SAVING_ALERT_MESSAGE",
                    messageType: "Information",
                    message: "Please save changes in prior to import price group.",
                    category: "RFQ",
                    modifiedDate: new Date(COMMON.getCurrentUTC()),
                    action: "I"
                }]
            };
            break;
        case 699:
            msgobj = {
                messageBuildNumber: 700,
                developer: "Shirish",
                message: [{
                    messageCode: "RFQ50011",
                    messageKey: "RFQ_PRICE_GROUP_ALREADY_EXISTS",
                    messageType: "Information",
                    message: "Following price group already exists.",
                    category: "RFQ",
                    modifiedDate: new Date(COMMON.getCurrentUTC()),
                    action: "I"
                }]
            };
            break;
        case 700:
            msgobj = {
                messageBuildNumber: 701,
                developer: "Shirish",
                message: [{
                    messageCode: "RFQ50010",
                    messageKey: "IMPORT_PRICE_GROUP_WITHOUT_SAVING_ALERT_MESSAGE",
                    messageType: "Information",
                    message: "Please save changes in prior to {0} price group {1}.",
                    category: "RFQ",
                    modifiedDate: new Date(COMMON.getCurrentUTC()),
                    action: "U"
                }]
            };
            break;
        case 701:
            msgobj = {
                messageBuildNumber: 702,
                developer: "Ashish",
                message: [{
                    messageCode: "RCV20113",
                    messageKey: "BIN_MISMATCH",
                    messageType: "Error",
                    message: "Selected bin <b>{0}</b> and physical bin <b>{1}</b> are mismatched.",
                    category: "RECEIVING",
                    createdDate: new Date(COMMON.getCurrentUTC()),
                    action: "I"
                }]
            };
            break;
        case 702:
            msgobj = {
                messageBuildNumber: 703,
                developer: "Dharmesh",
                message: [{
                    messageCode: "MST50033",
                    messageKey: "ADMIN_CHECK_MAIL_FOR_RESET_PASSWORD",
                    messageType: "Information",
                    message: "An email has been sent to Administrator, please contact Administrator for password.",
                    category: "MASTER",
                    createdDate: new Date(COMMON.getCurrentUTC()),
                    action: "I"
                }]
            };
            break;
        case 703:
            msgobj = {
                messageBuildNumber: 704,
                developer: "Dharmesh",
                message: [{
                    messageCode: "MST50034",
                    messageKey: "RESET_PASSWORD",
                    messageType: "Information",
                    message: "Enter your Email ID or User ID and we will send you a link with which you can reset your password.",
                    category: "MASTER",
                    createdDate: new Date(COMMON.getCurrentUTC()),
                    action: "I"
                }]
            };
            break;


        case 704:
            msgobj = {
                messageBuildNumber: 705,
                developer: "Dharmesh",
                message: [{
                    messageCode: "MST20059",
                    messageKey: "EMAIL_SEND_FAILED",
                    messageType: "Error",
                    message: "Something went wrong while sending the mail. Please try again to get reset password link.",
                    category: "MASTER",
                    createdDate: new Date(COMMON.getCurrentUTC()),
                    action: "I"
                }]
            };
            break;
        case 705:
            msgobj = {
                messageBuildNumber: 706,
                developer: "Dharmesh",
                message: [{
                    messageCode: "RCV10007",
                    messageKey: "INITIATE_KIT_RETURN_SUCCESS",
                    messageType: "Success",
                    message: "Initiate return request has been sent successfully. Your kit is ready to return.",
                    category: "RECEIVING",
                    modifiedDate: new Date(COMMON.getCurrentUTC()),
                    action: "U"
                }]
            };
            break;
        case 706:
            msgobj = {
                messageBuildNumber: 707,
                developer: "Dharmesh",
                message: [{
                    messageCode: "RCV50024",
                    messageKey: "INITIATE_KIT_RETURN_WO_STATUS_CHANGE",
                    messageType: "Information",
                    message: "To initiate return request workorder status must be <b>Completed</b> or <b>Terminated</b> for <b>WO# {0}</b>.",
                    category: "RECEIVING",
                    modifiedDate: new Date(COMMON.getCurrentUTC()),
                    action: "U"
                }]
            };
            break;
        case 707:
            msgobj = {
                messageBuildNumber: 708,
                developer: "Dharmesh",
                message: [{
                    messageCode: "RCV20001",
                    messageKey: "NOT_ALLOW_RETURN_KIT_FOR_ALLOCATED_UMID",
                    messageType: "Error",
                    message: "You cannot return this kit as <b>{0}</b> UMIDs are allocated to this kit. Please consume/deallocate the inventory from the kit prior to return.",
                    category: "RECEIVING",
                    modifiedDate: new Date(COMMON.getCurrentUTC()),
                    action: "U"
                }]
            };
            break;
        case 708:
            msgobj = {
                messageBuildNumber: 709,
                developer: "Dharmesh",
                message: [{
                    messageCode: "RCV40018",
                    messageKey: "INITIATE_KIT_RETURN_CONFIRMATION",
                    messageType: "Confirmation",
                    message: "Are you sure? You want to Initiate Kit Return.",
                    category: "RECEIVING",
                    modifiedDate: new Date(COMMON.getCurrentUTC()),
                    action: "U"
                }]
            };
            break;

        case 709:
            msgobj = {
                messageBuildNumber: 710,
                developer: "Dharmesh",
                message: [{
                    messageCode: "RCV40004",
                    messageKey: "OTHER_KIT_STOCK_EXISTS_WITH_KIT",
                    messageType: "Confirmation",
                    message: "Kit <b>{0}</b> warehouse(s) have other kit(s) <b>{1}</b> inventory. Are you sure you want to transfer to <b>{2}</b>?",
                    category: "RECEIVING",
                    modifiedDate: new Date(COMMON.getCurrentUTC()),
                    action: "U"
                }]
            };
            break;
        case 710:
            msgobj = {
                messageBuildNumber: 711,
                developer: "Ketan",
                message: [{
                    messageCode: "GLB40021",
                    messageKey: "WITHOUT_APPLY_REFRESH_ALERT",
                    messageType: "Confirmation",
                    message: "You will lose all updated changes.<br/> Are you sure you want to refresh this page?",
                    category: "GLOBAL",
                    modifiedDate: new Date(COMMON.getCurrentUTC()),
                    action: "I"
                }]
            };
            break;
        case 711:
            msgobj = {
                messageBuildNumber: 712,
                developer: "Ketan",
                message: [{
                    messageCode: "GLB50020",
                    messageKey: "NOT_FIND_FOLDER_FILE_AT_SOURCE",
                    messageType: "Information",
                    message: "Could not find {0} at source place.",
                    category: "GLOBAL",
                    modifiedDate: new Date(COMMON.getCurrentUTC()),
                    action: "I"
                }]
            };
            break;
        case 712:
            msgobj = {
                messageBuildNumber: 713,
                developer: "Fenil",
                message: [{
                    messageCode: "RCV40020",
                    messageKey: "TRANSFER_BIN_WITH_UNALLOCATED_UMID_CONFIRMATION",
                    messageType: "Confirmation",
                    message: "Are you sure you want to transfer bin <b>{0}</b> from <b>{1}</b> to <b>{2}</b> which contains unallocated UMID?",
                    category: "RECEIVING",
                    createdDate: new Date(COMMON.getCurrentUTC()),
                    action: "I"
                }]
            };
            break;
        case 713:
            msgobj = {
                messageBuildNumber: 714,
                developer: "Fenil",
                message: [{
                    messageCode: "RCV40021",
                    messageKey: "BIN_TO_WH_TRANSFER_WITH_OTHER_KIT_CONFIRMATION_MSG",
                    messageType: "Confirmation",
                    message: "Are you sure you want to transfer bin <b>{0}</b> to warehouse <b>{1}</b> which contains inventory of {2}?",
                    category: "RECEIVING",
                    createdDate: new Date(COMMON.getCurrentUTC()),
                    action: "I"
                }]
            };
            break;
        case 714:
            msgobj = {
                messageBuildNumber: 715,
                developer: "Champak",
                message: [{
                    messageCode: "MFG20018",
                    messageKey: "INCOMIG_VALIDATION",
                    messageType: "Error",
                    message: "Rack# {0} is empty. Empty rack cannot be assign as incoming rack.",
                    category: "MFG",
                    createdDate: new Date(COMMON.getCurrentUTC()),
                    action: "U"
                }]
            };
            break;
        case 715:
            msgobj = {
                messageBuildNumber: 716,
                developer: "Champak",
                message: [{
                    messageCode: "MFG40008",
                    messageKey: "CLEAR_RACK_CONFIRM",
                    messageType: "Confirmation",
                    message: "Are you sure to clear {0} rack? Press Yes to Continue.",
                    category: "MFG",
                    createdDate: new Date(COMMON.getCurrentUTC()),
                    action: "U"
                }]
            };
            break;
        case 716:
            msgobj = {
                messageBuildNumber: 717,
                developer: "Champak",
                message: [{
                    messageCode: "MFG40007",
                    messageKey: "OUTGOING_CONFIRMATION",
                    messageType: "Confirmation",
                    message: "Rack# {0} is not allowed in current operation as incoming rack because it is already assigned in {1} operation of workorder {2} as {3} by user {4}.",
                    category: "MFG",
                    createdDate: new Date(COMMON.getCurrentUTC()),
                    action: "U"
                }]
            };
            break;
        case 717:
            msgobj = {
                messageBuildNumber: 718,
                developer: "Shweta",
                message: [{
                    messageCode: "MFG40009",
                    messageKey: "REQ_SHIP_STATUS_CHANGE",
                    messageType: "Confirmation",
                    message: "Shipping request status will be changed from {0} to {1}, Press Yes to Continue.",
                    category: "MFG",
                    createdDate: new Date(COMMON.getCurrentUTC()),
                    action: "I"
                }]
            };
            break;
        case 718:
            msgobj = {
                messageBuildNumber: 719,
                developer: "Shweta",
                message: [{
                    messageCode: "MFG20019",
                    messageKey: "SHIPPING_REQUEST_WORKORDER_EXISTS",
                    messageType: "Error",
                    message: "Shipping request for this work order already exists.",
                    category: "MFG",
                    createdDate: new Date(COMMON.getCurrentUTC()),
                    action: "I"
                }]
            };
            break;
        case 719:
            msgobj = {
                messageBuildNumber: 720,
                developer: "Shweta",
                message: [{
                    messageCode: "MFG20020",
                    messageKey: "SHIPPING_EMP_APPROVAL_EXISTS",
                    messageType: "Error",
                    message: "Personnel is already selected. Please select another personnel.",
                    category: "MFG",
                    createdDate: new Date(COMMON.getCurrentUTC()),
                    action: "I"
                }]
            };
            break;
        case 720:
            msgobj = {
                messageBuildNumber: 721,
                developer: "Shweta",
                message: [{
                    messageCode: "MFG20021",
                    messageKey: "FILL_DET_BEFORE_SAVE",
                    messageType: "Error",
                    message: "In prior to save {0}, you must have to add details.",
                    category: "MFG",
                    createdDate: new Date(COMMON.getCurrentUTC()),
                    action: "I"
                }]
            };
            break;
        case 721:
            msgobj = {
                messageBuildNumber: 722,
                developer: "Shweta",
                message: [{
                    messageCode: "GLB20044",
                    messageKey: "POPUP_ACCESS_DENIED",
                    messageType: "Error",
                    message: "You do not have permission to access {0} page. Please contact to administrator.",
                    category: "GLOBAL",
                    createdDate: new Date(COMMON.getCurrentUTC()),
                    action: "I"
                }]
            };
            break;
        case 722:
            msgobj = {
                messageBuildNumber: 723,
                developer: "Shweta",
                message: [{
                    messageCode: "MST20060",
                    messageKey: "INVALID_MFR_MAPPING",
                    messageType: "Error",
                    message: "Please map header with <b>{0}</b>.",
                    category: "MASTER",
                    createdDate: new Date(COMMON.getCurrentUTC()),
                    action: "I"
                }]
            };
            break;
        case 723:
            msgobj = {
                messageBuildNumber: 724,
                developer: "Ashish",
                message: [{
                    messageCode: "PRT20029",
                    messageKey: "BOM_PART_ALREADY_SELECTED",
                    messageType: "Error",
                    message: "BOM Part {0} already selected.",
                    category: "PARTS",
                    createdDate: new Date(COMMON.getCurrentUTC()),
                    action: "I"
                }]
            };
            break;
        case 724:
            msgobj = {
                messageBuildNumber: 725,
                developer: "Ashish",
                message: [{
                    messageCode: "PRT20029",
                    messageKey: "BOM_PART_ALREADY_SELECTED",
                    messageType: "Error",
                    message: "BOM Part <b>{0}</b> already selected.",
                    category: "PARTS",
                    modifiedDate: new Date(COMMON.getCurrentUTC()),
                    action: "U"
                }]
            };
            break;

        case 725:
            msgobj = {
                messageBuildNumber: 726,
                developer: "Dharmesh",
                message: [{
                    messageCode: "MST50033",
                    messageKey: "ADMIN_CHECK_MAIL_FOR_RESET_PASSWORD",
                    messageType: "Information",
                    message: "An email has been sent to Administrator.",
                    category: "MASTER",
                    modifiedDate: new Date(COMMON.getCurrentUTC()),
                    action: "U"
                }]
            };
            break;

        case 726:
            msgobj = {
                messageBuildNumber: 727,
                developer: "Dharmesh",
                message: [{
                    messageCode: "MST50034",
                    messageKey: "RESET_PASSWORD",
                    messageType: "Information",
                    message: "Enter your Email or User ID and we will send you a link with which you can reset your password.",
                    category: "MASTER",
                    modifiedDate: new Date(COMMON.getCurrentUTC()),
                    action: "U"
                }]
            };
            break;


        case 727:
            msgobj = {
                messageBuildNumber: 728,
                developer: "Dharmesh",
                message: [{
                    messageCode: "MST20059",
                    messageKey: "EMAIL_SEND_FAILED",
                    messageType: "Error",
                    message: "Something went wrong while sending the email. Please try again to get reset password link.",
                    category: "MASTER",
                    modifiedDate: new Date(COMMON.getCurrentUTC()),
                    action: "U"
                }]
            };
            break;

        case 728:
            msgobj = {
                messageBuildNumber: 729,
                developer: "Dharmesh",
                message: [{
                    messageCode: "MST50015",
                    messageKey: "CHECK_MAIL_FOR_RESET_PASSWORD",
                    messageType: "Information",
                    message: "Please check your email for reset password.",
                    category: "MASTER",
                    modifiedDate: new Date(COMMON.getCurrentUTC()),
                    action: "U"
                }]
            };
            break;
        case 729:
            msgobj = {
                messageBuildNumber: 730,
                developer: "Charmi",
                message: [{
                    messageCode: "GLB50021",
                    messageKey: "ATLEAST_ONE_GROUP_REQUIRED",
                    messageType: "Information",
                    message: "Atleast one group is required.",
                    category: "GLOBAL",
                    createdDate: new Date(COMMON.getCurrentUTC()),
                    action: "I"
                }]
            };
            break;
        case 730:
            msgobj = {
                messageBuildNumber: 731,
                developer: "Charmi",
                message: [{
                    messageCode: "GLB50022",
                    messageKey: "ATLEAST_ONE_CONDITION_REQUIRED",
                    messageType: "Information",
                    message: "Every group required atleast one condition.",
                    category: "GLOBAL",
                    createdDate: new Date(COMMON.getCurrentUTC()),
                    action: "I"
                }]
            };
            break;
        case 731:
            msgobj = {
                messageBuildNumber: 732,
                developer: "Ketan",
                message: [{
                    messageCode: "MFG50019",
                    messageKey: "LOOP_TO_OP_REQUIRED_FOR_WOOP_PUBLISH",
                    messageType: "Information",
                    message: "Current operation is Loop Operation. In prior to publish, <b>Loop To Operation</b> is required.",
                    category: "MFG",
                    createdDate: new Date(COMMON.getCurrentUTC()),
                    action: "I"
                }]
            };
            break;
        case 732:
            msgobj = {
                messageBuildNumber: 733,
                developer: "Fenil",
                message: [{
                    messageCode: "RCV20114",
                    messageKey: "PLANN_KIT_IN_SEQUENCE",
                    messageType: "Error",
                    message: "<b>{0}</b> must be in sequence.",
                    category: "RECEIVING",
                    createdDate: new Date(COMMON.getCurrentUTC()),
                    action: "I"
                }]
            };
            break;
        case 733:
            msgobj = {
                messageBuildNumber: 734,
                developer: "Shweta",
                message: [{
                    messageCode: "MST10069",
                    messageKey: "EMPLOYEE_CREDENTIAL_UPDATED",
                    messageType: "Success",
                    message: "Password has been changed successfully.",
                    category: "MASTER",
                    createdDate: new Date(COMMON.getCurrentUTC()),
                    action: "I"
                }]
            };
            break;
        case 734:
            msgobj = {
                messageBuildNumber: 735,
                developer: "Shweta",
                message: [{
                    messageCode: "GLB30006",
                    messageKey: "DELETE_ALERT_USED_MESSAGE_WITH_TRANSACTION_COUNT",
                    messageType: "Warning",
                    message: "Selected {0}(s) are in use. {1} to check transaction({2}) list.",
                    category: "GLOBAL",
                    modifiedDate: new Date(COMMON.getCurrentUTC()),
                    action: "U"
                }]
            };
            break;

        case 735:
            msgobj = {
                messageBuildNumber: 736,
                developer: "Champak",
                message: [{
                    messageCode: "RCV50025",
                    messageKey: "COLOR_PICKED_USER",
                    messageType: "Information",
                    message: "<b>{0}</b> color has been picked by user <b>{1}</b>. Press OK to Continue.",
                    category: "RECEIVING",
                    modifiedDate: new Date(COMMON.getCurrentUTC()),
                    action: "I"
                }]
            };
            break;

        case 736:
            msgobj = {
                messageBuildNumber: 737,
                developer: "Champak",
                message: [{
                    messageCode: "RCV40022",
                    messageKey: "COLOR_PICKED_USER_CONFIRM",
                    messageType: "Confirmation",
                    message: "<b>{0}</b> color already picked by user <b>{1}</b>. Are you sure to choose this color?  Press Yes to Continue.",
                    category: "RECEIVING",
                    modifiedDate: new Date(COMMON.getCurrentUTC()),
                    action: "I"
                }]
            };
            break;

        case 737:
            msgobj = {
                messageBuildNumber: 738,
                developer: "Champak",
                message: [{
                    messageCode: "RCV50026",
                    messageKey: "INVALID_REEL_PICK",
                    messageType: "Information",
                    message: "You have pickup incorrect UMID <b>{0}</b>! Which is already been searched by <b>{1}</b> user with <b>{2}</b> color. You must need to transfer this UMID to another Warehouse.Press OK to Continue.",
                    category: "RECEIVING",
                    modifiedDate: new Date(COMMON.getCurrentUTC()),
                    action: "I"
                }]
            };
            break;

        case 738:
            msgobj = {
                messageBuildNumber: 739,
                developer: "Fenil",
                message: [{
                    messageCode: "RCV40014",
                    messageKey: "UOM_MISMATCH",
                    messageType: "Confirmation",
                    message: "Line number(s) <b>{0}</b> have mismatched UOM. Please resolve that in BOM to do kit allocation for those line number(s) by pressing GO TO BOM or press OK to continue on page.",
                    category: "RECEIVING",
                    createdDate: new Date(COMMON.getCurrentUTC()),
                    action: "U"
                }]
            };
            break;

        case 739:
            msgobj = {
                messageBuildNumber: 740,
                developer: "Anil",
                message: [{
                    messageCode: "MST30012",
                    messageKey: "INACTIVE_LABEL_TEMPLATE",
                    messageType: "Warning",
                    message: "To set default label template, you need to active it first.",
                    category: "MASTER",
                    createdDate: new Date(COMMON.getCurrentUTC()),
                    action: "I"
                }]
            };
            break;
        case 740:
            msgobj = {
                messageBuildNumber: 741,
                developer: "Fenil",
                message: [{
                    messageCode: "RCV20115",
                    messageKey: "KIt_RELEASE_CHANGE_MRP_KIT_QTY_NOT_GRETER_FOR_SUB_ASSY",
                    messageType: "Confirmation",
                    message: "Total of <b>Promised Ship Qty From PO</b> of main assembly plan is greater then <b>PO Qty</b> or <b>Planned Kit & Planned Build Qty</b> of main assembly plan is greater then <b>Kit Qty</b> respectively. <br />Please change <b>Promised Ship Qty From PO</b> and <b>Planned Kit & Planned Build Qty</b> from <b>Change Planing</b> pop-up.",
                    category: "RECEIVING",
                    createdDate: new Date(COMMON.getCurrentUTC()),
                    action: "I"
                }]
            };
            break;
        case 741:
            msgobj = {
                messageBuildNumber: 742,
                developer: "Fenil",
                message: [{
                    messageCode: "RCV20017",
                    messageKey: "MISMATCH_KIT_ALLOCATION_QTY_PLAN_KIT_QTY",
                    messageType: "Error",
                    message: "Total of <b>Promised Ship Qty From PO</b> is mismatch with <b>PO Qty</b> or Total of <b>Planned Kit & Planned Build Qty</b> is mismatch with <b>Kit Qty</b>. Please correct it.",
                    category: "RECEIVING",
                    createdDate: new Date(COMMON.getCurrentUTC()),
                    action: "U"
                }]
            };
            break;
        case 742:
            msgobj = {
                messageBuildNumber: 743,
                developer: "Fenil",
                message: [{
                    messageCode: "RCV20115",
                    messageKey: "KIt_RELEASE_CHANGE_MRP_KIT_QTY_NOT_GRETER_FOR_SUB_ASSY",
                    messageType: "Confirmation",
                    message: "Total of <b>Promised Ship Qty From PO</b> of main assembly plan is greater then <b>PO Qty</b> or <b>Planned Kit & Planned Build Qty</b> of main assembly plan is greater then <b>Kit Qty</b> respectively. <br />Please change <b>Promised Ship Qty From PO</b> and <b>Planned Kit & Planned Build Qty</b> of main assembly plan from <b>Change Planing</b> pop-up.",
                    category: "RECEIVING",
                    createdDate: new Date(COMMON.getCurrentUTC()),
                    action: "U"
                }]
            };
            break;
        case 743:
            msgobj = {
                messageBuildNumber: 744,
                developer: "Anil",
                message: [{
                    messageCode: "MST30012",
                    messageKey: "INACTIVE_LABEL_TEMPLATE",
                    messageType: "Warning",
                    message: "To set the default label template, you need to set the status to active.",
                    category: "MASTER",
                    createdDate: new Date(COMMON.getCurrentUTC()),
                    action: "U"
                }]
            };
            break;
        case 744:
            msgobj = {
                messageBuildNumber: 745,
                developer: "Shweta",
                message: [{
                    messageCode: "MST40029",
                    messageKey: "MOUNTING_TYPE_PENDING_ADD",
                    messageType: "Confirmation",
                    message: "Entered mounting type is not added yet. Do you want to continue?",
                    category: "MASTER",
                    createdDate: new Date(COMMON.getCurrentUTC()),
                    action: "I"
                }]
            };
            break;
        case 745:
            msgobj = {
                messageBuildNumber: 746,
                developer: "Fenil",
                message: [{
                    messageCode: "RCV20081",
                    messageKey: "WITH_RESERVE",
                    messageType: "Error",
                    message: "In selected record some record is reserve, Please check the selected record.",
                    category: "RECEIVING",
                    createdDate: new Date(COMMON.getCurrentUTC()),
                    action: "I"
                }]
            };
            break;
        case 746:
            msgobj = {
                messageBuildNumber: 747,
                developer: "Fenil",
                message: [{
                    messageCode: "RCV20082",
                    messageKey: "INVAID_CATEGORY",
                    messageType: "Error",
                    message: "Cost category not found for quantity.",
                    category: "RECEIVING",
                    createdDate: new Date(COMMON.getCurrentUTC()),
                    action: "I"
                }]
            };
            break;
        case 747:
            msgobj = {
                messageBuildNumber: 748,
                developer: "Fenil",
                message: [{
                    messageCode: "RCV20083",
                    messageKey: "WITHOUT_RESERVE",
                    messageType: "Error",
                    message: "In selected record some record is without reserve, Please check the selected record.",
                    category: "RECEIVING",
                    createdDate: new Date(COMMON.getCurrentUTC()),
                    action: "I"
                }]
            };
            break;
        case 748:
            msgobj = {
                messageBuildNumber: 749,
                developer: "Fenil",
                message: [{
                    messageCode: "GLB20027",
                    messageKey: "INVALID_DOC_FILE",
                    messageType: "Error",
                    message: "Only csv,xls document type allowed.",
                    category: "GLOBAL",
                    createdDate: new Date(COMMON.getCurrentUTC()),
                    action: "I"
                }]
            };
            break;
        case 749:
            msgobj = {
                messageBuildNumber: 750,
                developer: "Fenil",
                message: [{
                    messageCode: "RCV20084",
                    messageKey: "UMID_IMPORT_COLUMN_NOT_MAPPED",
                    messageType: "Error",
                    message: "Column(s) <b>{0}</b> is not mapped with excel column(s). Please map all column(s) and try again.",
                    category: "RECEIVING",
                    createdDate: new Date(COMMON.getCurrentUTC()),
                    action: "I"
                }]
            };
            break;
        case 750:
            msgobj = {
                messageBuildNumber: 751,
                developer: "Charmi",
                message: [{
                    messageCode: "GLB40022",
                    messageKey: "MAIN_SEARCH_REMOVED",
                    messageType: "Confirmation",
                    message: "By applying advance search the main search wll be removed, Press Yes to Continue.",
                    category: "GLOBAL",
                    createdDate: new Date(COMMON.getCurrentUTC()),
                    action: "I"
                }]
            };
            break;
        case 751:
            msgobj = {
                messageBuildNumber: 752,
                developer: "Fenil",
                message: [{
                    messageCode: "RCV20116",
                    messageKey: "TRANSFER_BIN_WITH_UNALLOCATED_UMID_EROR",
                    messageType: "Error",
                    message: "You cannot transfer bin <b>{0}</b> from <b>{1}</b> to <b>{2}</b> because bin contains unallocated UMID.",
                    category: "RECEIVING",
                    createdDate: new Date(COMMON.getCurrentUTC()),
                    action: "I"
                }]
            };
            break;
        case 752:
            msgobj = {
                messageBuildNumber: 753,
                developer: "Ashish",
                message: [{
                    messageCode: "PRT20030",
                    messageKey: "SYSTEM_GENERATED_PARTS_DELETE_NOT_ALLOWED",
                    messageType: "Error",
                    message: "System generated parts are not allowed to delete.",
                    category: "PARTS",
                    createdDate: new Date(COMMON.getCurrentUTC()),
                    action: "I"
                }]
            };
            break;
        case 753:
            msgobj = {
                messageBuildNumber: 754,
                developer: "Shirish",
                message: [{
                    messageCode: "RFQ40012",
                    messageKey: "COPY_PRICE_SELECTION_CONFIRMATION",
                    messageType: "Confirmation",
                    message: "Are you sure to copy {0} price selection to {1} price selection?<br> It will overwrite the existing price selection setting.",
                    category: "RFQ",
                    modifiedDate: new Date(COMMON.getCurrentUTC()),
                    action: "I"
                }]
            };
            break;
        case 754:
            msgobj = {
                messageBuildNumber: 755,
                developer: "Shirish",
                message: [{
                    messageCode: "RFQ10005",
                    messageKey: "PRICE_SELECTION_SETTING_COPIED",
                    messageType: "Success",
                    message: "Price selection setting copied successfully",
                    category: "RFQ",
                    modifiedDate: new Date(COMMON.getCurrentUTC()),
                    action: "I"
                }]
            };
            break;
        case 755:
            msgobj = {
                messageBuildNumber: 756,
                developer: "Shirish",
                message: [{
                    messageCode: "RFQ20006",
                    messageKey: "INVALID_LEADTIME_ENTERED",
                    messageType: "Error",
                    message: "Invalid lead time entered. Please add proper value.",
                    category: "RFQ",
                    modifiedDate: new Date(COMMON.getCurrentUTC()),
                    action: "I"
                }]
            };
            break;
        case 756:
            msgobj = {
                messageBuildNumber: 757,
                developer: "Shirish",
                message: [{
                    messageCode: "RFQ50012",
                    messageKey: "ACTIVITY_STARTED_ON_OTHER_QUOTE_GROUP_ASSEMBLY",
                    messageType: "Information",
                    message: "Activity started on other quote group assembly.<br/> Please try after some time.",
                    category: "RFQ",
                    modifiedDate: new Date(COMMON.getCurrentUTC()),
                    action: "I"
                }]
            };
            break;
        case 757:
            msgobj = {
                messageBuildNumber: 758,
                developer: "Dharmesh",
                message: [{
                    messageCode: "RCV40033",
                    messageKey: "RERELEASE_KIT",
                    messageType: "Confirmation",
                    message: "This is non-allocated work order returned plan. Are you sure you want to re-release this plan?",
                    category: "RECEIVING",
                    createdDate: new Date(COMMON.getCurrentUTC()),
                    action: "I"
                }]
            };
            break;

        case 758:
            msgobj = {
                messageBuildNumber: 759,
                developer: "Dharmesh",
                message: [{
                    messageCode: "RCV20152",
                    messageKey: "ASSIGN_WORKORDER_TO_PLAN",
                    messageType: "Error",
                    message: "Please assign WO in previously released plans.",
                    category: "RECEIVING",
                    createdDate: new Date(COMMON.getCurrentUTC()),
                    action: "I"
                }]
            };
            break;
        case 759:
            msgobj = {
                messageBuildNumber: 760,
                developer: "Anil",
                message: [{
                    messageCode: "RCV40023",
                    messageKey: "RACK_COUNT",
                    messageType: "Confirmation",
                    message: "Total {0} rack(s) will be generated. Are you sure? Press Yes to continue.",
                    category: "RECEIVING",
                    createdDate: new Date(COMMON.getCurrentUTC()),
                    action: "I"
                }]
            };
            break;
        case 760:
            msgobj = {
                messageBuildNumber: 761,
                developer: "Anil",
                message: [{
                    messageCode: "GLB30013",
                    messageKey: "LENGTH_CANNOT_GREATER",
                    messageType: "Warning",
                    message: "{0} cannot be greater than {1} characters.",
                    category: "GLOBAL",
                    createdDate: new Date(COMMON.getCurrentUTC()),
                    action: "I"
                }]
            };
            break;
        case 761:
            msgobj = {
                messageBuildNumber: 762,
                developer: "Fenil",
                message: [{
                    messageCode: "RCV20117",
                    messageKey: "TRANSFER_WITHIN_DEPARTMENT",
                    messageType: "Error",
                    message: "Stock must be transfer within parent warehouse.",
                    category: "RECEIVING",
                    createdDate: new Date(COMMON.getCurrentUTC()),
                    action: "I"
                }]
            };
            break;
        case 762:
            msgobj = {
                messageBuildNumber: 763,
                developer: "Fenil",
                message: [{
                    messageCode: "RCV20118",
                    messageKey: "TRANSFER_TO_OTHER_DEPARTMENT",
                    messageType: "Error",
                    message: "Stock cannot be transfer within parent warehouse.",
                    category: "RECEIVING",
                    createdDate: new Date(COMMON.getCurrentUTC()),
                    action: "I"
                }]
            };
            break;
        case 763:
            msgobj = {
                messageBuildNumber: 764,
                developer: "Fenil",
                message: [{
                    messageCode: "RCV20119",
                    messageKey: "NOT_ALLOW_WITHIN_WH",
                    messageType: "Error",
                    message: "Not allowed to transfer within warehouse.",
                    category: "RECEIVING",
                    createdDate: new Date(COMMON.getCurrentUTC()),
                    action: "I"
                }]
            };
            break;
        case 764:
            msgobj = {
                messageBuildNumber: 765,
                developer: "Fenil",
                message: [{
                    messageCode: "RCV20120",
                    messageKey: "NOT_TRANSFER_PARMANENT_WH_TO_OTHER_DEPT",
                    messageType: "Error",
                    message: "You cannot transfer permanent warehouse <b>{0}</b> to <b>{1}</b>.",
                    category: "RECEIVING",
                    createdDate: new Date(COMMON.getCurrentUTC()),
                    action: "I"
                }]
            };
            break;
        case 765:
            msgobj = {
                messageBuildNumber: 766,
                developer: "Fenil",
                message: [{
                    messageCode: "RCV20121",
                    messageKey: "NOT_TRANSFER_PENDING_UMID_PART_WH",
                    messageType: "Error",
                    message: "You cannot transfer warehouse <b>{0}</b>, as it contains pending UMID parts.",
                    category: "RECEIVING",
                    createdDate: new Date(COMMON.getCurrentUTC()),
                    action: "I"
                }]
            };
            break;
        case 766:
            msgobj = {
                messageBuildNumber: 767,
                developer: "Fenil",
                message: [{
                    messageCode: "RCV20122",
                    messageKey: "NOT_TRANSFER_EMPTY_WH",
                    messageType: "Error",
                    message: "You cannot transfer empty warehouse.",
                    category: "RECEIVING",
                    createdDate: new Date(COMMON.getCurrentUTC()),
                    action: "I"
                }]
            };
            break;
        case 767:
            msgobj = {
                messageBuildNumber: 768,
                developer: "Fenil",
                message: [{
                    messageCode: "RCV20123",
                    messageKey: "NOT_TRANSFER_WH_OTHER_THEN_SHELVING_CART",
                    messageType: "Error",
                    message: "You cannot transfer bin(s) of <b>{0} ({1})</b> to other warehouse.",
                    category: "RECEIVING",
                    createdDate: new Date(COMMON.getCurrentUTC()),
                    action: "I"
                }]
            };
            break;
        case 768:
            msgobj = {
                messageBuildNumber: 769,
                developer: "Fenil",
                message: [{
                    messageCode: "RCV20124",
                    messageKey: "BIN_NOT_TRANSFER_OTHER_THEN_SHELVING_CART",
                    messageType: "Error",
                    message: "You cannot transfer bin(s) of warehouse <b>{0}</b> to <b>{1} ({2})</b>.",
                    category: "RECEIVING",
                    createdDate: new Date(COMMON.getCurrentUTC()),
                    action: "I"
                }]
            };
            break;
        case 769:
            msgobj = {
                messageBuildNumber: 770,
                developer: "Fenil",
                message: [{
                    messageCode: "RCV20125",
                    messageKey: "NOT_TRANSFER_WH_WITH_PERMANENT_BIN",
                    messageType: "Error",
                    message: "You cannot transfer bin(s) of warehouse <b>[{0}]</b>, as it contains permanent bin.",
                    category: "RECEIVING",
                    createdDate: new Date(COMMON.getCurrentUTC()),
                    action: "I"
                }]
            };
            break;
        case 770:
            msgobj = {
                messageBuildNumber: 771,
                developer: "Fenil",
                message: [{
                    messageCode: "RCV20126",
                    messageKey: "NOT_TRANSFER_WH_TO_WH_WITH_PERMANENT_BIN",
                    messageType: "Error",
                    message: "You cannot transfer to warehouse <b>[{0}]</b>, as warehouse <b>[{0}]</b> contains permanent bin.",
                    category: "RECEIVING",
                    createdDate: new Date(COMMON.getCurrentUTC()),
                    action: "I"
                }]
            };
            break;
        case 771:
            msgobj = {
                messageBuildNumber: 772,
                developer: "Fenil",
                message: [{
                    messageCode: "RCV20127",
                    messageKey: "NOT_TRANSFER_Bin_TO_WH_WITH_PERMANENT_BIN",
                    messageType: "Error",
                    message: "You cannot transfer bin <b>[{0}]</b> to warehouse <b>[{1}]</b> containing permanent bin.",
                    category: "RECEIVING",
                    createdDate: new Date(COMMON.getCurrentUTC()),
                    action: "I"
                }]
            };
            break;
        case 772:
            msgobj = {
                messageBuildNumber: 773,
                developer: "Fenil",
                message: [{
                    messageCode: "RCV20128",
                    messageKey: "NOT_ALLOW_WITHIN_BIN",
                    messageType: "Error",
                    message: "Not allow to transfer within bin.",
                    category: "RECEIVING",
                    createdDate: new Date(COMMON.getCurrentUTC()),
                    action: "I"
                }]
            };
            break;
        case 773:
            msgobj = {
                messageBuildNumber: 774,
                developer: "Fenil",
                message: [{
                    messageCode: "RCV20129",
                    messageKey: "NOT_TRANSFER_EMPTY_BIN",
                    messageType: "Error",
                    message: "You cannot transfer empty bin.",
                    category: "RECEIVING",
                    createdDate: new Date(COMMON.getCurrentUTC()),
                    action: "I"
                }]
            };
            break;
        case 774:
            msgobj = {
                messageBuildNumber: 775,
                developer: "Fenil",
                message: [{
                    messageCode: "RCV20130",
                    messageKey: "NOT_TRANSFER_SMART_CART_BIN",
                    messageType: "Error",
                    message: "You cannot transfer UMID(s) of <b>Smart Cart</b>. Please use <b>Transfer Material</b> screen from UMID Management.",
                    category: "RECEIVING",
                    createdDate: new Date(COMMON.getCurrentUTC()),
                    action: "I"
                }]
            };
            break;
        case 775:
            msgobj = {
                messageBuildNumber: 776,
                developer: "Fenil",
                message: [{
                    messageCode: "RCV20131",
                    messageKey: "NOT_TRANSFER_EQUIPMENT_BIN",
                    messageType: "Error",
                    message: "You cannot transfer UMID(s) of <b>Equipment</b>. Please use <b>Feeder</b> screen from traveler page.",
                    category: "RECEIVING",
                    createdDate: new Date(COMMON.getCurrentUTC()),
                    action: "I"
                }]
            };
            break;
        case 776:
            msgobj = {
                messageBuildNumber: 777,
                developer: "Fenil",
                message: [{
                    messageCode: "RCV20132",
                    messageKey: "NOT_TRANSFER_TO_SMART_CART_BIN",
                    messageType: "Error",
                    message: "You cannot transfer UMID(s) to <b>Smart Cart</b>. Please use <b>Transfer Material</b> screen from UMID Management.",
                    category: "RECEIVING",
                    createdDate: new Date(COMMON.getCurrentUTC()),
                    action: "I"
                }]
            };
            break;
        case 777:
            msgobj = {
                messageBuildNumber: 778,
                developer: "Fenil",
                message: [{
                    messageCode: "RCV20133",
                    messageKey: "NOT_TRANSFER_TO_EQUIPMENT_BIN",
                    messageType: "Error",
                    message: "You cannot transfer UMID(s) to <b>Equipment</b>. Please use <b>Feeder</b> screen from traveler page.",
                    category: "RECEIVING",
                    createdDate: new Date(COMMON.getCurrentUTC()),
                    action: "I"
                }]
            };
            break;
        case 778:
            msgobj = {
                messageBuildNumber: 779,
                developer: "Fenil",
                message: [{
                    messageCode: "RCV20134",
                    messageKey: "KIT_ALREADY_RELEASED",
                    messageType: "Error",
                    message: "Kit already full released so you cannot do release again.",
                    category: "RECEIVING",
                    createdDate: new Date(COMMON.getCurrentUTC()),
                    action: "I"
                }]
            };
            break;
        case 779:
            msgobj = {
                messageBuildNumber: 780,
                developer: "Fenil",
                message: [{
                    messageCode: "RCV20135",
                    messageKey: "REQUIRE_ALLOCATION_FOR_RELEASE",
                    messageType: "Error",
                    message: "To release kit, please allocate inventory first.",
                    category: "RECEIVING",
                    createdDate: new Date(COMMON.getCurrentUTC()),
                    action: "I"
                }]
            };
            break;
        case 780:
            msgobj = {
                messageBuildNumber: 781,
                developer: "Fenil",
                message: [{
                    messageCode: "RCV20136",
                    messageKey: "SELECT_PARENT_WAREHOUSE",
                    messageType: "Error",
                    message: "Select parent warehouse to transfer material.",
                    category: "RECEIVING",
                    createdDate: new Date(COMMON.getCurrentUTC()),
                    action: "I"
                }]
            };
            break;
        case 781:
            msgobj = {
                messageBuildNumber: 782,
                developer: "Fenil",
                message: [{
                    messageCode: "RCV20137",
                    messageKey: "NOT_RIGHT_FOR_FEATURE",
                    messageType: "Error",
                    message: "You don't have rights of <b>{0}</b> feature. Please contact to your superior to get rights/access of this feature.",
                    category: "RECEIVING",
                    createdDate: new Date(COMMON.getCurrentUTC()),
                    action: "I"
                }]
            };
            break;
        case 782:
            msgobj = {
                messageBuildNumber: 783,
                developer: "Fenil",
                message: [{
                    messageCode: "RCV20138",
                    messageKey: "BIN_TO_BIN_NOT_ALLOW",
                    messageType: "Error",
                    message: "Bin to bin transfer not allowed to another department.",
                    category: "RECEIVING",
                    createdDate: new Date(COMMON.getCurrentUTC()),
                    action: "I"
                }]
            };
            break;
        case 783:
            msgobj = {
                messageBuildNumber: 784,
                developer: "Fenil",
                message: [{
                    messageCode: "RCV20139",
                    messageKey: "TRANSFER_WH_WITH_UNALLOCATED_UMID_EROR",
                    messageType: "Error",
                    message: "You cannot transfer warehouse <b>{0}</b> from <b>{1}</b> to <b>{2}</b> because warehouse contains unallocated UMID.",
                    category: "RECEIVING",
                    createdDate: new Date(COMMON.getCurrentUTC()),
                    action: "I"
                }]
            };
            break;
        case 784:
            msgobj = {
                messageBuildNumber: 785,
                developer: "Fenil",
                message: [{
                    messageCode: "RCV20140",
                    messageKey: "NON_UMID_STOCK_EXISTS_WITH_KIT",
                    messageType: "Error",
                    message: "You cannot transfer kit <b>{0}</b> to <b>{1}</b>, as this kit bin(s) <b>{2}</b> have stock for which UMID creation is pending.",
                    category: "RECEIVING",
                    createdDate: new Date(COMMON.getCurrentUTC()),
                    action: "I"
                }]
            };
            break;
        case 785:
            msgobj = {
                messageBuildNumber: 786,
                developer: "Fenil",
                message: [{
                    messageCode: "RCV20141",
                    messageKey: "NOT_TRANSFER_PERMANENT_WH",
                    messageType: "Error",
                    message: "These warehouses <b>({0})</b> which are transfer for a kit is a permanent warehouse. So first transfer stock from permanent to movable warehouse and then transfer again.",
                    category: "RECEIVING",
                    createdDate: new Date(COMMON.getCurrentUTC()),
                    action: "I"
                }]
            };
            break;
        case 786:
            msgobj = {
                messageBuildNumber: 787,
                developer: "Fenil",
                message: [{
                    messageCode: "RCV20142",
                    messageKey: "SCAN_WH_ParentWH_INVALID",
                    messageType: "Error",
                    message: "Warehouse is not belongs to selected parent warehouse.",
                    category: "RECEIVING",
                    createdDate: new Date(COMMON.getCurrentUTC()),
                    action: "I"
                }]
            };
            break;
        case 787:
            msgobj = {
                messageBuildNumber: 788,
                developer: "Fenil",
                message: [{
                    messageCode: "RCV40024",
                    messageKey: "INACTIVE_WH_ALERT_BODY_MESSAGE",
                    messageType: "Confirmation",
                    message: "Are you sure you want to deactive this warehouse? Once you deactive this warehouse will remove from list. Press Yes to Continue.",
                    category: "RECEIVING",
                    createdDate: new Date(COMMON.getCurrentUTC()),
                    action: "I"
                }]
            };
            break;
        case 788:
            msgobj = {
                messageBuildNumber: 789,
                developer: "Fenil",
                message: [{
                    messageCode: "RCV40025",
                    messageKey: "INACTIVE_BIN_ALERT_BODY_MESSAGE",
                    messageType: "Confirmation",
                    message: "Are you sure you want to deactive this bin? Once you deactive this bin will remove from list. Press Yes to Continue.",
                    category: "RECEIVING",
                    createdDate: new Date(COMMON.getCurrentUTC()),
                    action: "I"
                }]
            };
            break;
        case 789:
            msgobj = {
                messageBuildNumber: 790,
                developer: "Fenil",
                message: [{
                    messageCode: "RCV40026",
                    messageKey: "WH_TO_MATERIAL_DEPT_TRANSFER_WITH_OTHER_KIT_CONFIRMATION_MSG",
                    messageType: "Confirmation",
                    message: "Are you sure you want to transfer all bin(s) of warehouse <b>{0}</b> to warehouse <b>{1}</b> which contains inventory of kit {2}?",
                    category: "RECEIVING",
                    createdDate: new Date(COMMON.getCurrentUTC()),
                    action: "I"
                }]
            };
            break;
        case 790:
            msgobj = {
                messageBuildNumber: 791,
                developer: "Fenil",
                message: [{
                    messageCode: "RCV40027",
                    messageKey: "TRANSFER_WH_WITH_ALLOCATED_KIT_CONFIRMATION",
                    messageType: "Confirmation",
                    message: "Are you sure you want to transfer warehouse <b>{0}</b> from <b>{1}</b> to <b>{2}</b> which contains inventory of {3}?",
                    category: "RECEIVING",
                    createdDate: new Date(COMMON.getCurrentUTC()),
                    action: "I"
                }]
            };
            break;
        case 791:
            msgobj = {
                messageBuildNumber: 792,
                developer: "Fenil",
                message: [{
                    messageCode: "RCV40028",
                    messageKey: "WH_TO_WH_TRANSFER_CONFIRMATION_MSG",
                    messageType: "Confirmation",
                    message: "Are you sure you want to transfer all bins of selected warehouse <b>'{0}'</b> to warehouse <b>'{1}'</b>? Press Yes to Continue.",
                    category: "RECEIVING",
                    createdDate: new Date(COMMON.getCurrentUTC()),
                    action: "I"
                }]
            };
            break;
        case 792:
            msgobj = {
                messageBuildNumber: 793,
                developer: "Fenil",
                message: [{
                    messageCode: "RCV40029",
                    messageKey: "BIN_TO_WH_TRANSFER_CONFIRMATION_MSG",
                    messageType: "Confirmation",
                    message: "Are you sure you want to transfer selected bin <b>'{0}'</b> to warehouse <b>'{1}'</b>? Press Yes to Continue.",
                    category: "RECEIVING",
                    createdDate: new Date(COMMON.getCurrentUTC()),
                    action: "I"
                }]
            };
            break;
        case 793:
            msgobj = {
                messageBuildNumber: 794,
                developer: "Fenil",
                message: [{
                    messageCode: "RCV40030",
                    messageKey: "WH_TO_DEPT_TRANSFER_CONFIRMATION_MSG",
                    messageType: "Confirmation",
                    message: "Are you sure you want to transfer selected warehouse <b>'{0}'</b> to <b>'{1}'</b>? Press Yes to Continue.",
                    category: "RECEIVING",
                    createdDate: new Date(COMMON.getCurrentUTC()),
                    action: "I"
                }]
            };
            break;
        case 794:
            msgobj = {
                messageBuildNumber: 795,
                developer: "Fenil",
                message: [{
                    messageCode: "RCV20143",
                    messageKey: "SCAN_BIN_ParentWH_INVALID",
                    messageType: "Error",
                    message: "Bin is not belongs to selected parent warehouse.",
                    category: "RECEIVING",
                    createdDate: new Date(COMMON.getCurrentUTC()),
                    action: "I"
                }]
            };
            break;
        case 795:
            msgobj = {
                messageBuildNumber: 796,
                developer: "Fenil",
                message: [{
                    messageCode: "RCV20144",
                    messageKey: "SCAN_BIN_WH_INVALID",
                    messageType: "Error",
                    message: "Bin is not belongs to selected warehouse.",
                    category: "RECEIVING",
                    createdDate: new Date(COMMON.getCurrentUTC()),
                    action: "I"
                }]
            };
            break;
        case 796:
            msgobj = {
                messageBuildNumber: 797,
                developer: "Fenil",
                message: [{
                    messageCode: "RCV40031",
                    messageKey: "INITIAL_COUNT_CONFIRMATION",
                    messageType: "Confirmation",
                    message: "Are you sure you want to change <b>initial count</b> to <b>{0}</b> and <b>units</b> to <b>{1} ({2})</b>?",
                    category: "RECEIVING",
                    createdDate: new Date(COMMON.getCurrentUTC()),
                    action: "I"
                }]
            };
            break;
        case 797:
            msgobj = {
                messageBuildNumber: 798,
                developer: "Fenil",
                message: [{
                    messageCode: "RCV40032",
                    messageKey: "INITIAL_COUNT_CONFIRMATION_FOR_KIT_ALLOCATION",
                    messageType: "Confirmation",
                    message: "UMID allocated to kit <b>{0}</b>. {1} <br> You will lose kit allocation data.",
                    category: "RECEIVING",
                    createdDate: new Date(COMMON.getCurrentUTC()),
                    action: "I"
                }]
            };
            break;
        case 798:
            msgobj = {
                messageBuildNumber: 799,
                developer: "Fenil",
                message: [{
                    messageCode: "RCV20145",
                    messageKey: "NOT_ALLOW_TRASFER_EMPTY_STOCK",
                    messageType: "Error",
                    message: "You cannot transfer empty stock.",
                    category: "RECEIVING",
                    createdDate: new Date(COMMON.getCurrentUTC()),
                    action: "I"
                }]
            };
            break;
        case 799:
            msgobj = {
                messageBuildNumber: 800,
                developer: "Fenil",
                message: [{
                    messageCode: "RCV20146",
                    messageKey: "SCAN_WH_BIN_NOT_FOUND",
                    messageType: "Error",
                    message: "Scanned warehouse/bin not found.",
                    category: "RECEIVING",
                    createdDate: new Date(COMMON.getCurrentUTC()),
                    action: "I"
                }]
            };
            break;
        case 800:
            msgobj = {
                messageBuildNumber: 801,
                developer: "Fenil",
                message: [{
                    messageCode: "RCV20147",
                    messageKey: "SAME_FROM_TO_BIN",
                    messageType: "Error",
                    message: "You cannot transfer UMID within same bin.",
                    category: "RECEIVING",
                    createdDate: new Date(COMMON.getCurrentUTC()),
                    action: "I"
                }]
            };
            break;
        case 801:
            msgobj = {
                messageBuildNumber: 802,
                developer: "Fenil",
                message: [{
                    messageCode: "RCV20148",
                    messageKey: "EMPTY_STOCK_INVALID_BIN",
                    messageType: "Error",
                    message: "You have scanned invalid bin to transfer empty stock. Please scan empty bin.",
                    category: "RECEIVING",
                    createdDate: new Date(COMMON.getCurrentUTC()),
                    action: "I"
                }]
            };
            break;
        case 802:
            msgobj = {
                messageBuildNumber: 803,
                developer: "Fenil",
                message: [{
                    messageCode: "RCV20149",
                    messageKey: "NON_EMPTY_STOCK_INVALID_BIN",
                    messageType: "Error",
                    message: "You cannot transfer inventory to empty bin. Please select valid bin.",
                    category: "RECEIVING",
                    createdDate: new Date(COMMON.getCurrentUTC()),
                    action: "I"
                }]
            };
            break;
        case 803:
            msgobj = {
                messageBuildNumber: 804,
                developer: "Fenil",
                message: [{
                    messageCode: "RCV20150",
                    messageKey: "STOCK_QTY_LESS_OR_EQUAL_ORG_QTY",
                    messageType: "Error",
                    message: "{0} quantity must be equal or less than original quantity <b>{1}</b>.",
                    category: "RECEIVING",
                    createdDate: new Date(COMMON.getCurrentUTC()),
                    action: "I"
                }]
            };
            break;
        case 804:
            msgobj = {
                messageBuildNumber: 805,
                developer: "Fenil",
                message: [{
                    messageCode: "RCV20151",
                    messageKey: "STATUS_OFFLINE_WH",
                    messageType: "Error",
                    message: "{0} warehouse is Offline, please try later on.",
                    category: "RECEIVING",
                    createdDate: new Date(COMMON.getCurrentUTC()),
                    action: "I"
                }]
            };
            break;
        case 805:
            msgobj = {
                messageBuildNumber: 806,
                developer: "Fenil",
                message: [{
                    messageCode: "RCV20153",
                    messageKey: "REEL_MISMATCH",
                    messageType: "Error",
                    message: "Selected reel <b>{0}</b> and physical reel <b>{1}</b> are mismatched.",
                    category: "RECEIVING",
                    createdDate: new Date(COMMON.getCurrentUTC()),
                    action: "I"
                }]
            };
            break;
        case 806:
            msgobj = {
                messageBuildNumber: 807,
                developer: "Fenil",
                message: [{
                    messageCode: "RCV50027",
                    messageKey: "DEPARTMENT_SUCCESSFUL_UPDATE",
                    messageType: "Information",
                    message: "Department Assigned Successfully. Please retry for check-in request.",
                    category: "RECEIVING",
                    createdDate: new Date(COMMON.getCurrentUTC()),
                    action: "I"
                }]
            };
            break;
        case 807:
            msgobj = {
                messageBuildNumber: 808,
                developer: "Fenil",
                message: [{
                    messageCode: "RCV40034",
                    messageKey: "COUNT_MATERIAL_CONFIRMATION_WITH_SELECTED_KIT",
                    messageType: "Confirmation",
                    message: "<b>{0}</b> have <b>{1} {2}</b> will consumed against <b>{3}</b>. {4}",
                    category: "RECEIVING",
                    createdDate: new Date(COMMON.getCurrentUTC()),
                    action: "I"
                }]
            };
            break;
        case 808:
            msgobj = {
                messageBuildNumber: 809,
                developer: "Fenil",
                message: [{
                    messageCode: "RCV40035",
                    messageKey: "COUNT_MATERIAL_CONFIRMATION_WITHOUT_SELECTED_KIT_FOR_DEALLOCATE",
                    messageType: "Confirmation",
                    message: "You did not selected any kit, so consumed quantity will create shortages and system will auto deallocated from Kit based on farthest allocated assembly DOCK date. {0}",
                    category: "RECEIVING",
                    createdDate: new Date(COMMON.getCurrentUTC()),
                    action: "I"
                }]
            };
            break;
        case 809:
            msgobj = {
                messageBuildNumber: 810,
                developer: "Fenil",
                message: [{
                    messageCode: "RCV40036",
                    messageKey: "COUNT_MATERIAL_CONFIRMATION_WITHOUT_SELECTED_KIT",
                    messageType: "Confirmation",
                    message: "You did not selected any kit, so consumption will not adjust against any kit and system will auto deallocated from Kit based on farthest allocated assembly DOCK date. {0}",
                    category: "RECEIVING",
                    createdDate: new Date(COMMON.getCurrentUTC()),
                    action: "I"
                }]
            };
            break;
        case 810:
            msgobj = {
                messageBuildNumber: 811,
                developer: "Fenil",
                message: [{
                    messageCode: "RCV40037",
                    messageKey: "ANOTHER_TRANSFER_UMID",
                    messageType: "Confirmation",
                    message: "If you want to transfer another UMID then press Yes to Continue.",
                    category: "RECEIVING",
                    createdDate: new Date(COMMON.getCurrentUTC()),
                    action: "I"
                }]
            };
            break;
        case 811:
            msgobj = {
                messageBuildNumber: 812,
                developer: "Fenil",
                message: [{
                    messageCode: "RCV40038",
                    messageKey: "STOCK_UPDATE_CONFIRMATION",
                    messageType: "Confirmation",
                    message: "Are you sure you want to adjust {0} quantity to <b>{1} ({2})</b>?",
                    category: "RECEIVING",
                    createdDate: new Date(COMMON.getCurrentUTC()),
                    action: "I"
                }]
            };
            break;
        case 812:
            msgobj = {
                messageBuildNumber: 813,
                developer: "Fenil",
                message: [{
                    messageCode: "RCV40039",
                    messageKey: "ADJUSTED_MATERIAL_MORE_THAN_CONFIGURED",
                    messageType: "Confirmation",
                    message: "Adjusted quantity is more than <b>{0}%</b>. {1}",
                    category: "RECEIVING",
                    createdDate: new Date(COMMON.getCurrentUTC()),
                    action: "I"
                }]
            };
            break;
        case 813:
            msgobj = {
                messageBuildNumber: 814,
                developer: "Fenil",
                message: [{
                    messageCode: "RCV40040",
                    messageKey: "CONSUMED_MATERIAL_MORE_THAN_CONFIGURED",
                    messageType: "Confirmation",
                    message: "Consumed quantity is more than <b>{0}%</b>. {1}",
                    category: "RECEIVING",
                    createdDate: new Date(COMMON.getCurrentUTC()),
                    action: "I"
                }]
            };
            break;
        case 814:
            msgobj = {
                messageBuildNumber: 815,
                developer: "Fenil",
                message: [{
                    messageCode: "RCV40041",
                    messageKey: "DEPART_MISMATCH_INOAUTO",
                    messageType: "Confirmation",
                    message: "In System <b>{0}</b> warehouse belongs to <b>{1}</b> department. For check-in request <b>{0}</b> parent warehouse status must be same in inovaxe and system. Do you want to assign <b>{1}</b> department in inovaxe for <b>{0}</b>? Press Yes to Continue.",
                    category: "RECEIVING",
                    createdDate: new Date(COMMON.getCurrentUTC()),
                    action: "I"
                }]
            };
            break;
        case 815:
            msgobj = {
                messageBuildNumber: 816,
                developer: "Fenil",
                message: [{
                    messageCode: "RCV20154",
                    messageKey: "EQUIPMENT_NOT_SCAN",
                    messageType: "Error",
                    message: "{0} dose not allow to scan because it is belong to equipment.",
                    category: "RECEIVING",
                    createdDate: new Date(COMMON.getCurrentUTC()),
                    action: "I"
                }]
            };
            break;
        case 816:
            msgobj = {
                messageBuildNumber: 817,
                developer: "Fenil",
                message: [{
                    messageCode: "RCV40042",
                    messageKey: "COUNT_MATERIAL_CONFIRMATION",
                    messageType: "Confirmation",
                    message: "Are you sure you want to transfer and update quantity of this UMID?",
                    category: "RECEIVING",
                    createdDate: new Date(COMMON.getCurrentUTC()),
                    action: "I"
                }]
            };
            break;
        case 817:
            msgobj = {
                messageBuildNumber: 818,
                developer: "Fenil",
                message: [{
                    messageCode: "RCV20155",
                    messageKey: "NOT_ALLOW_DIFFRENT_DEPARTMENT_FOR_PACKINGSLIP",
                    messageType: "Error",
                    message: "Please select location/bin of <b>{0}</b>, as <b>{1}</b> is belongs to other parent warehouse i.e. <b>{2}</b>.",
                    category: "RECEIVING",
                    createdDate: new Date(COMMON.getCurrentUTC()),
                    action: "I"
                }]
            };
            break;
        case 818:
            msgobj = {
                messageBuildNumber: 819,
                developer: "Fenil",
                message: [{
                    messageCode: "RCV40005",
                    messageKey: "RELEASE_CONFIRMATION",
                    messageType: "Confirmation",
                    message: "This will transfer all allocated inventory to <b>{0}</b>. Are you sure you want to release planned kit# <b>{1}</b>?",
                    category: "RECEIVING",
                    createdDate: new Date(COMMON.getCurrentUTC()),
                    action: "U"
                }]
            };
            break;
        case 819:
            msgobj = {
                messageBuildNumber: 820,
                developer: "Fenil",
                message: [{
                    messageCode: "RCV40045",
                    messageKey: "KIT_TO_DEPT_TRANSFER_CONFIRMATION_MSG",
                    messageType: "Confirmation",
                    message: "Are you sure you want to transfer selected kit <b>'{0}'</b> to <b>'{1}'</b>? Press Yes to Continue.",
                    category: "RECEIVING",
                    createdDate: new Date(COMMON.getCurrentUTC()),
                    action: "I"
                }]
            };
            break;
        case 820:
            msgobj = {
                messageBuildNumber: 821,
                developer: "Fenil",
                message: [{
                    messageCode: "RCV40046",
                    messageKey: "TRANSFER_KIT_WITH_ALLOCATED_KIT_CONFIRMATION",
                    messageType: "Confirmation",
                    message: "Are you sure you want to transfer kit <b>{0}</b> from <b>{1}</b> to <b>{2}</b> which contains inventory of {3}?",
                    category: "RECEIVING",
                    createdDate: new Date(COMMON.getCurrentUTC()),
                    action: "I"
                }]
            };
            break;

        case 821:
            msgobj = {
                messageBuildNumber: 822,
                developer: "Dharmesh",
                message: [{
                    messageCode: "GLB40012",
                    messageKey: "SURE_TO_IMPORT_GENERICCATEGRY_FILE",
                    messageType: "Confirmation",
                    message: "Are you sure you want to import the selected document as {0}? Press yes to continue.",
                    category: "GLOBAL",
                    modifiedDate: new Date(COMMON.getCurrentUTC()),
                    action: "U"
                }]
            };
            break;
        case 822:
            msgobj = {
                messageBuildNumber: 823,
                developer: "Fenil",
                message: [{
                    messageCode: "RCV40047",
                    messageKey: "BIN_TO_BIN_TRANSFER_CONFIRMATION_MSG",
                    messageType: "Confirmation",
                    message: "Are you sure you want to transfer all UMIDs of the selected bin <b>'{0}'</b> to bin <b>'{1}'</b>? Press Yes to Continue.",
                    category: "RECEIVING",
                    createdDate: new Date(COMMON.getCurrentUTC()),
                    action: "I"
                }]
            };
            break;
        case 823:
            msgobj = {
                messageBuildNumber: 824,
                developer: "Fenil",
                message: [{
                    messageCode: "RCV40048",
                    messageKey: "UID_TO_BIN_TRANSFER_CONFIRMATION_MSG",
                    messageType: "Confirmation",
                    message: "Are you sure you want to transfer selected UMID <b>'{0}'</b> to bin <b>'{1}'</b>? Press Yes to Continue.",
                    category: "RECEIVING",
                    createdDate: new Date(COMMON.getCurrentUTC()),
                    action: "I"
                }]
            };
            break;
        case 824:
            msgobj = {
                messageBuildNumber: 825,
                developer: "Fenil",
                message: [{
                    messageCode: "RCV20156",
                    messageKey: "EMPTY_BIN_NOT_TRANSFER_IN_SAME_KIT_WH",
                    messageType: "Error",
                    message: "You cannot transfer empty bin(s) to warehouse which is containing stock of same kit.",
                    category: "RECEIVING",
                    createdDate: new Date(COMMON.getCurrentUTC()),
                    action: "I"
                }]
            };
            break;
        case 825:
            msgobj = {
                messageBuildNumber: 826,
                developer: "Fenil",
                message: [{
                    messageCode: "RCV20157",
                    messageKey: "EMPTY_BIN_NOT_TRANSFER_OTHER_THEN_SHELVING_CART",
                    messageType: "Error",
                    message: "You cannot transfer empty bin(s) to <b>{0}</b>.",
                    category: "RECEIVING",
                    createdDate: new Date(COMMON.getCurrentUTC()),
                    action: "I"
                }]
            };
            break;
        case 826:
            msgobj = {
                messageBuildNumber: 827,
                developer: "Fenil",
                message: [{
                    messageCode: "RCV20158",
                    messageKey: "EMPTY_BIN_NOT_TRANSFER_TO_PERMANENT_BIN_WH",
                    messageType: "Error",
                    message: "You cannot transfer empty bin(s) to warehouse containing permanent bin.",
                    category: "RECEIVING",
                    createdDate: new Date(COMMON.getCurrentUTC()),
                    action: "I"
                }]
            };
            break;
        case 827:
            msgobj = {
                messageBuildNumber: 828,
                developer: "Fenil",
                message: [{
                    messageCode: "RCV40049",
                    messageKey: "EMPTY_BIN_TRANSFER_CONFIRMATION",
                    messageType: "Confirmation",
                    message: "Are you sure you want to transfer empty bin(s) to warehouse <b>{0}</b> of parent warehouse <b>{1}</b>?",
                    category: "RECEIVING",
                    createdDate: new Date(COMMON.getCurrentUTC()),
                    action: "I"
                }]
            };
            break;
        case 828:
            msgobj = {
                messageBuildNumber: 829,
                developer: "Shweta",
                message: [{
                    messageCode: "MST40031",
                    messageKey: "ENTITY_PERMISSION_CONFIRMATION",
                    messageType: "Confirmation",
                    message: "Select rights for selected personnel.  <\br> * Add Only - User can add records. But visible onlt own records in custom form.<\br> * All - All records will be visible in custom form.",
                    category: "MASTER",
                    createdDate: new Date(COMMON.getCurrentUTC()),
                    action: "I"
                }]
            };
            break;
        case 829:
            msgobj = {
                messageBuildNumber: 830,
                developer: "Shweta",
                message: [{
                    messageCode: "MST10070",
                    messageKey: "ENTITY_PERMISSION_UPDATED",
                    messageType: "Success",
                    message: "Personnel permission updated successfuly.",
                    category: "MASTER",
                    createdDate: new Date(COMMON.getCurrentUTC()),
                    action: "I"
                }]
            };
            break;
        case 830:
            msgobj = {
                messageBuildNumber: 831,
                developer: "Shubham",
                message: [{
                    messageCode: "GLB20045",
                    messageKey: "MAX_LENGTH",
                    messageType: "Error",
                    message: "Max {1} char, You have entered {0} char.",
                    category: "GLOBAL",
                    createdDate: new Date(COMMON.getCurrentUTC()),
                    action: "I"
                }]
            };
            break;
        case 831:
            msgobj = {
                messageBuildNumber: 832,
                developer: "Shirish",
                message: [{
                    messageCode: "MST40032",
                    messageKey: "EMPLOYEE_RESPONSIBILITY_CHANGE_CONFIRMATION",
                    messageType: "Confirmation",
                    message: "Are you sure to change personnel responsibility?",
                    category: "MASTER",
                    modifiedDate: new Date(COMMON.getCurrentUTC()),
                    action: "I"
                }]
            };
            break;
        case 832:
            msgobj = {
                messageBuildNumber: 833,
                developer: "Shweta",
                message: [{
                    messageCode: "MST40031",
                    messageKey: "ENTITY_PERMISSION_CONFIRMATION",
                    messageType: "Confirmation",
                    message: "Select rights for selected personnel.  <br/> * Add Only - User can add records, but visible only own records in custom form.<br/> * All - All records will be visible in custom form.",
                    category: "MASTER",
                    createdDate: new Date(COMMON.getCurrentUTC()),
                    action: "U"
                }]
            };
            break;
        case 833:
            msgobj = {
                messageBuildNumber: 834,
                developer: "Fenil",
                message: [{
                    messageCode: "RCV20152",
                    messageKey: "ASSIGN_WORKORDER_TO_PLAN",
                    messageType: "Error",
                    message: "First please assign WO in previously released plans after that you can assign WO in current release plan.",
                    category: "RECEIVING",
                    createdDate: new Date(COMMON.getCurrentUTC()),
                    action: "U"
                }]
            };
            break;
        case 834:
            msgobj = {
                messageBuildNumber: 835,
                developer: "Fenil",
                message: [{
                    messageCode: "RCV20159",
                    messageKey: "REMOVE_WORKORDER_TO_PLAN",
                    messageType: "Error",
                    message: "Your next plans have already assign WO so you cannot remove WO for current plan. Please remove WO to next plans for remove WO for current plan.",
                    category: "RECEIVING",
                    createdDate: new Date(COMMON.getCurrentUTC()),
                    action: "I"
                }]
            };
            break;
        case 835:
            msgobj = {
                messageBuildNumber: 836,
                developer: "Shirish",
                message: [{
                    messageCode: "MST40030",
                    messageKey: "IMPORT_CUSTOMER_DETAIL_UPDATE_CONFIRMATION",
                    messageType: "Confirmation",
                    message: "Following customer are already added in system, have to update existing record?<br>Press <b>Yes</b> to continue with update existing data or press <b>No</b> to upload only not exists data.",
                    category: "MASTER",
                    modifiedDate: new Date(COMMON.getCurrentUTC()),
                    action: "I"
                }]
            };
            break;
        case 836:
            msgobj = {
                messageBuildNumber: 837,
                developer: "Shirish",
                message: [{
                    messageCode: "RFQ50014",
                    messageKey: "RFQ_ASSY_QTY_REQUIRED",
                    messageType: "Information",
                    message: "At least one assembly quantity requires except price group quantity for the following assembly.",
                    category: "RFQ",
                    modifiedDate: new Date(COMMON.getCurrentUTC()),
                    action: "I"
                }]
            };
            break;
        case 837:
            msgobj = {
                messageBuildNumber: 838,
                developer: "Shirish",
                message: [{
                    messageCode: "RFQ40013",
                    messageKey: "RFQ_REMOVE_ALL_ASSEMBLY_QTY_MSG",
                    messageType: "Confirmation",
                    message: "Are you sure to remove all assembly quantity?",
                    category: "RFQ",
                    modifiedDate: new Date(COMMON.getCurrentUTC()),
                    action: "I"
                }]
            };
            break;
        case 838:
            msgobj = {
                messageBuildNumber: 839,
                developer: "Ketan",
                message: [{
                    messageCode: "GLB20016",
                    messageKey: "DocumentSizeError_NotAllowed",
                    messageType: "Error",
                    message: "From selected document(s) size of some file(s) are more than {0}, which is not allowed. Please check selected document(s).",
                    category: "GLOBAL",
                    createdDate: new Date(COMMON.getCurrentUTC()),
                    action: "U"
                }]
            };
            break;
        case 839:
            msgobj = {
                messageBuildNumber: 840,
                developer: "Charmi",
                message: [{
                    messageCode: "RCV40043",
                    messageKey: "TRANSFER_WH_UNALLOCATED_UMID_WITH_PASSWORD_CONFIRMATION",
                    messageType: "Confirmation",
                    message: "Please enter password and reason to transfer unallocated UMID(s) with warehouse <b>{0}</b> from <b>{1}</b> to <b>{2}</b>.",
                    category: "RECEIVING",
                    createdDate: new Date(COMMON.getCurrentUTC()),
                    action: "I"
                }]
            };
            break;
        case 840:
            msgobj = {
                messageBuildNumber: 841,
                developer: "Charmi",
                message: [{
                    messageCode: "RCV40044",
                    messageKey: "TRANSFER_BIN_UNALLOCATED_UMID_WITH_PASSWORD_CONFIRMATION",
                    messageType: "Confirmation",
                    message: "Please enter password and reason to transfer unallocated UMID(s) with bin <b>{0}</b> from <b>{1}</b> to <b>{2}</b>.",
                    category: "RECEIVING",
                    createdDate: new Date(COMMON.getCurrentUTC()),
                    action: "I"
                }]
            };
            break;
        case 841:
            msgobj = {
                messageBuildNumber: 842,
                developer: "Charmi",
                message: [{
                    messageCode: "RCV40050",
                    messageKey: "TRANSFER_UNALLOCATED_UMID_WITH_PASSWORD_CONFIRMATION",
                    messageType: "Confirmation",
                    message: "Please enter password and reason to transfer unallocated UMID <b>{0}</b> from <b>{1}</b> to <b>{2}</b>.",
                    category: "RECEIVING",
                    createdDate: new Date(COMMON.getCurrentUTC()),
                    action: "I"
                }]
            };
            break;
        case 842:
            msgobj = {
                messageBuildNumber: 843,
                developer: "Anil",
                message: [{
                    messageCode: "RCV50028",
                    messageKey: "SMARTCART_IS_NOT_ONLINE",
                    messageType: "Information",
                    message: "The cart {0} is not online.",
                    category: "RECEIVING",
                    createdDate: new Date(COMMON.getCurrentUTC()),
                    action: "I"
                }]
            };
            break;
        case 843:
            msgobj = {
                messageBuildNumber: 844,
                developer: "Anil",
                message: [{
                    messageCode: "RCV50029",
                    messageKey: "SELECT_BIN_WITH_UMID",
                    messageType: "Information",
                    message: "Please select bin(s) with allocated UMID.",
                    category: "RECEIVING",
                    createdDate: new Date(COMMON.getCurrentUTC()),
                    action: "I"
                }]
            };
            break;
        case 844:
            msgobj = {
                messageBuildNumber: 845,
                developer: "Anil",
                message: [{
                    messageCode: "RCV50030",
                    messageKey: "ENTER_VALID_SMARTCART_NAME",
                    messageType: "Information",
                    message: "Please enter smart cart name like <b>{0}-L</b> or <b>{0}-R</b> for transferring material to a smart cart.",
                    category: "RECEIVING",
                    createdDate: new Date(COMMON.getCurrentUTC()),
                    action: "I"
                }]
            };
            break;
        case 845:
            msgobj = {
                messageBuildNumber: 846,
                developer: "Anil",
                message: [{
                    messageCode: "RCV20118",
                    messageKey: "TRANSFER_TO_OTHER_DEPARTMENT",
                    messageType: "Error",
                    message: "Stock cannot be transferred within the parent warehouse.",
                    category: "RECEIVING",
                    createdDate: new Date(COMMON.getCurrentUTC()),
                    action: "U"
                }]
            };
            break;
        case 846:
            msgobj = {
                messageBuildNumber: 847,
                developer: "Ketan",
                message: [{
                    messageCode: "MFG50020",
                    messageKey: "ZERO_AVAILABLE_QTY_SERIAL_NOTE",
                    messageType: "Information",
                    message: "Note: Quantity not available for further processing. Please check issue quantity for current operation or complete previous operation quantity first.",
                    category: "MFG",
                    createdDate: new Date(COMMON.getCurrentUTC()),
                    action: "I"
                }]
            };
            break;
        case 847:
            msgobj = {
                messageBuildNumber: 848,
                developer: "Fenil",
                message: [
                    {
                        messageCode: "RCV40017",
                        messageKey: "FORCE_RETURN",
                        messageType: "Confirmation",
                        message: "Are you sure? You want initiate kit return for this kit forcefully as WO is not assigned against <b>Plan# {0}</b>.",
                        category: "RECEIVING",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "U"
                    }
                ]
            };
            break;
        case 848:
            msgobj = {
                messageBuildNumber: 849,
                developer: "Fenil",
                message: [
                    {
                        messageCode: "RCV20160",
                        messageKey: "SO_COMPLETED_NOT_KIT_ALLOACTE",
                        messageType: "Error",
                        message: "This sales order already completed so you cannot allocate any stock in this kit.",
                        category: "RECEIVING",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 849:
            msgobj = {
                messageBuildNumber: 850,
                developer: "Fenil",
                message: [
                    {
                        messageCode: "RCV20161",
                        messageKey: "KIT_RETURN_WO_STATUS_CHANGE",
                        messageType: "Error",
                        message: "To return request for WO# <b>{0}</b>. The workorder status must be either completed or terminated.",
                        category: "RECEIVING",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 850:
            msgobj = {
                messageBuildNumber: 851,
                developer: "Ashish",
                message: [
                    {
                        messageCode: "MST20061",
                        messageKey: "MIN_AND_MAX_OPERATING_TEMPERATURE_VALIDATION",
                        messageType: "Error",
                        message: "Min Operating Temperature must be less or equal to Max Operating Temperature.",
                        category: "MASTER",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 851:
            msgobj = {
                messageBuildNumber: 852,
                developer: "Ketan",
                message: [{
                    messageCode: "GLB40023",
                    messageKey: "WITHOUT_SAVING_ALERT_LEAVE_SELECTED",
                    messageType: "Confirmation",
                    message: "You will lose all unsaved changes for {0}.<br/> Are you sure want to leave?",
                    category: "GLOBAL",
                    createdDate: new Date(COMMON.getCurrentUTC()),
                    action: "I"
                }]
            };
            break;
        case 852:
            msgobj = {
                messageBuildNumber: 853,
                developer: "Ketan",
                message: [{
                    messageCode: "MFG50021",
                    messageKey: "SERIAL_ALREADY_ADDED_FOR_WOOP_FIRSTPCS",
                    messageType: "Information",
                    message: "Serial number already exists in {0}. Please check.",
                    category: "MFG",
                    createdDate: new Date(COMMON.getCurrentUTC()),
                    action: "I"
                }]
            };
            break;
        case 853:
            msgobj = {
                messageBuildNumber: 854,
                developer: "Ashish",
                message: [
                    {
                        messageCode: "PRT20032",
                        messageKey: "PACKAGING_ALIAS_MOUNTING_TYPE_VALIDATION",
                        messageType: "Error",
                        message: "<b>{0}</b> mounting type for part <b>{1}</b> is mismatched with its packaging alias of <b>{2}</b> mounting type, you cannot change mounting type.",
                        category: "PARTS",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 854:
            msgobj = {
                messageBuildNumber: 855,
                developer: "Ashish",
                message: [
                    {
                        messageCode: "PRT40023",
                        messageKey: "COMPONENT_VALIDATION_MESSAGES_CONTENT_STRING",
                        messageType: "Confirmation",
                        message: "Are you sure to change following?<br>*{0}<br>Press Yes to Continue.",
                        category: "PARTS",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 855:
            msgobj = {
                messageBuildNumber: 856,
                developer: "Ashish",
                message: [
                    {
                        messageCode: "PRT50005",
                        messageKey: "RESTRICT_USE_INCLUDING_PACKAGING_ALIAS_WITH_PERMISSION",
                        messageType: "Information",
                        message: "Restrict Use Including Packaging Alias (With Permission)",
                        category: "PARTS",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 856:
            msgobj = {
                messageBuildNumber: 857,
                developer: "Ashish",
                message: [
                    {
                        messageCode: "PRT50006",
                        messageKey: "RESTRICT_USE_INCLUDING_PACKAGING_ALIAS_PERMANENTLY",
                        messageType: "Information",
                        message: "Restrict Use Including Packaging Alias (Permanently)",
                        category: "PARTS",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 857:
            msgobj = {
                messageBuildNumber: 858,
                developer: "Ashish",
                message: [
                    {
                        messageCode: "PRT50007",
                        messageKey: "THIS_WILL_UNRESTRICT_ALL_PACKAGING_ALIAS_PARTS",
                        messageType: "Information",
                        message: ", this will unrestrict all Packaging alias parts.",
                        category: "PARTS",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 858:
            msgobj = {
                messageBuildNumber: 859,
                developer: "Ashish",
                message: [
                    {
                        messageCode: "PRT50008",
                        messageKey: "PACKAGING_ALIAS_PART",
                        messageType: "Information",
                        message: "Packaging Alias Part",
                        category: "PARTS",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 859:
            msgobj = {
                messageBuildNumber: 860,
                developer: "Ashish",
                message: [
                    {
                        messageCode: "PRT50009",
                        messageKey: "ALTERNATE_PARTS",
                        messageType: "Information",
                        message: "Alternate Parts",
                        category: "PARTS",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 860:
            msgobj = {
                messageBuildNumber: 861,
                developer: "Ashish",
                message: [
                    {
                        messageCode: "PRT50010",
                        messageKey: "ROHS_REPLACEMENT_PARTS",
                        messageType: "Information",
                        message: "RoHS Replacement Parts",
                        category: "PARTS",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 861:
            msgobj = {
                messageBuildNumber: 862,
                developer: "Ashish",
                message: [
                    {
                        messageCode: "PRT40024",
                        messageKey: "PART_STATUS_ACTIVE_TO_NON_ACTIVE_UPDATE",
                        messageType: "Confirmation",
                        message: "You are updating part status from <b>{0}</b> to <b>{1}</b>.",
                        category: "PARTS",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 862:
            msgobj = {
                messageBuildNumber: 863,
                developer: "Ashish",
                message: [
                    {
                        messageCode: "PRT40025",
                        messageKey: "COMPONENT_RESTRICT_FLAG_UPDATE_CONFIRMATION_MESSAGE",
                        messageType: "Confirmation",
                        message: "<b>{0}</b>? This will also updated in all packaging alias parts.",
                        category: "PARTS",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 863:
            msgobj = {
                messageBuildNumber: 864,
                developer: "Ashish",
                message: [
                    {
                        messageCode: "PRT40026",
                        messageKey: "ALTERNATE_PART_VALIDATION_CONFIRMATION_BODY_MESSAGE",
                        messageType: "Confirmation",
                        message: "Parameters/Functional type? This part already used as <b>{0}</b> this will mismatch attributes please verify it.",
                        category: "PARTS",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 864:
            msgobj = {
                messageBuildNumber: 865,
                developer: "Charmi",
                message: [
                    {
                        messageCode: "GLB20046",
                        messageKey: "ATLEAST_ONE_INSPECTION_REQUIREMENT",
                        messageType: "Error",
                        message: "Please select at least one requirement.",
                        category: "GLOBAL",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 865:
            msgobj = {
                messageBuildNumber: 866,
                developer: "Shirish",
                message: [
                    {
                        messageCode: "MST40033",
                        messageKey: "ROHS_PEER_CHANGE_CONFIRMATION",
                        messageType: "Confirmation",
                        message: "Are you sure to change RoHS peers?",
                        category: "MASTER",
                        modifiedDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 866:
            msgobj = {
                messageBuildNumber: 867,
                developer: "Shirish",
                message: [
                    {
                        messageCode: "MST20062",
                        messageKey: "INVALID_PARENT_ROHS",
                        messageType: "Error",
                        message: "Selected parent RoHS is map with same RoHS as different level, Please check and verify same.",
                        category: "MASTER",
                        modifiedDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 867:
            msgobj = {
                messageBuildNumber: 868,
                developer: "Shirish",
                message: [
                    {
                        messageCode: "MST20063",
                        messageKey: "INVALID_PEER_ROHS",
                        messageType: "Error",
                        message: "Selected peer RoHS is map with same RoHS as different level, Please check and verify same.",
                        category: "MASTER",
                        modifiedDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 868:
            msgobj = {
                messageBuildNumber: 869,
                developer: "Ketan",
                message: [
                    {
                        messageCode: "GLB50024",
                        messageKey: "DESTINATION_SAME_AS_SOURCE_MOVE",
                        messageType: "Information",
                        message: "The destination folder is the same as the source folder.",
                        category: "GLOBAL",
                        modifiedDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 869:
            msgobj = {
                messageBuildNumber: 870,
                developer: "Ketan",
                message: [
                    {
                        messageCode: "GLB10017",
                        messageKey: "FOLDER_DOC_BOTH_ACTION_SUCCESS",
                        messageType: "Success",
                        message: "Folder(s)/Document(s) {0} successfully.",
                        category: "GLOBAL",
                        modifiedDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 870:
            msgobj = {
                messageBuildNumber: 871,
                developer: "Ketan",
                message: [
                    {
                        messageCode: "GLB20047",
                        messageKey: "DESTINATION_IS_SUB_FOLDER_SOURCE",
                        messageType: "Error",
                        message: "The destination folder is a subfolder of the source folder.",
                        category: "GLOBAL",
                        modifiedDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 871:
            msgobj = {
                messageBuildNumber: 872,
                developer: "Shweta",
                message: [
                    {
                        messageCode: "GLB50023",
                        messageKey: "CUSTOM_FORM_STATUS_CHANGE_NOTIFICATION",
                        messageType: "Information",
                        message: "Custom form <b>{0}</b> status changed to {1}.",
                        category: "GLOBAL",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 872:
            msgobj = {
                messageBuildNumber: 873,
                developer: "Shweta",
                message: [
                    {
                        messageCode: "MFG20022",
                        messageKey: "CHANGE_STATUS_WORKORDER_WITH_ACTIVE_OP",
                        messageType: "Error",
                        message: "<b>1. Work order production is ongoing.<br/>Hint: In this case, please ask personnel(s) to stop their current activity from traveler page, and then you should able to change status.</b>",
                        category: "MFG",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 873:
            msgobj = {
                messageBuildNumber: 874,
                developer: "Shweta",
                message: [
                    {
                        messageCode: "MFG20023",
                        messageKey: "CHANGE_STATUS_WORKORDER_WITHOUT_ACTIVE_OP",
                        messageType: "Error",
                        message: "<b>1. Logged-in user does not have rights to perform this action.<br/>2. Work order status is either \"Terminated\" or \"Completed\" or \"Void\".</b>",
                        category: "MFG",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 874:
            msgobj = {
                messageBuildNumber: 875,
                developer: "Shweta",
                message: [
                    {
                        messageCode: "GLB40024",
                        messageKey: "LOGOUT_ALERT",
                        messageType: "Confirmation",
                        message: "Assigned work order operation is not completed yet, do you want to logout? <br/> {0} to check Active Operation list.",
                        category: "GLOBAL",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 875:
            msgobj = {
                messageBuildNumber: 876,
                developer: "Fenil",
                message: [
                    {
                        messageCode: "PRT20031",
                        messageKey: "PURCHASE_REQUIREMENT_ALREADY_EXIStS",
                        messageType: "Error",
                        message: "Purchase requirement already exists in list please select another purchase requirement.",
                        category: "PARTS",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 876:
            msgobj = {
                messageBuildNumber: 877,
                developer: "Fenil",
                message: [
                    {
                        messageCode: "PRT40022",
                        messageKey: "CONFIRMATION_SAVE_PURCHASE_INSPECTION_TYPE",
                        messageType: "Confirmation",
                        message: "This part does contains some existing purchase inspection requirements, to merge with them click on Merge to Continue or to override existing click Override to Continue.",
                        category: "PARTS",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 877:
            msgobj = {
                messageBuildNumber: 878,
                developer: "Fenil",
                message: [
                    {
                        messageCode: "RCV20164",
                        messageKey: "PS_RECEIVED_STATUS_NOT_ALLOW_INVOICE_DETAIL",
                        messageType: "Error",
                        message: "Received status of packing slip line# <b>{0}</b> is <b>{1}</b> so you cannot invoice line detail.",
                        category: "RECEIVING",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 878:
            msgobj = {
                messageBuildNumber: 879,
                developer: "Fenil",
                message: [
                    {
                        messageCode: "RCV20165",
                        messageKey: "PS_RECEIVED_STATUS_NOT_ALLOW_UMID",
                        messageType: "Error",
                        message: "You cannot create UMID because packing slip line received status is <b>{0}</b>.",
                        category: "RECEIVING",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 879:
            msgobj = {
                messageBuildNumber: 880,
                developer: "Shirish",
                message: [
                    {
                        messageCode: "RFQ50015",
                        messageKey: "QUOTE_NOT_AVAILABLE",
                        messageType: "Information",
                        message: "Your Quote is in progress. The Quote tab will become available once <br/> Summary tab has been submitted.",
                        category: "RFQ",
                        modifiedDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 880:
            msgobj = {
                messageBuildNumber: 881,
                developer: "Shirish",
                message: [
                    {
                        messageCode: "RFQ50016",
                        messageKey: "QUOTE_VERSION_CHANGED_BY_REVISED_QUOTE",
                        messageType: "Information",
                        message: "Quote version is changed because of revised quote.<br/> Please try again for generate summary.",
                        category: "RFQ",
                        modifiedDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 881:
            msgobj = {
                messageBuildNumber: 882,
                developer: "Shirish",
                message: [
                    {
                        messageCode: "RFQ50017",
                        messageKey: "PART_COSTING_NOT_SUBMITTED",
                        messageType: "Information",
                        message: "Part costing must be submitted before to generate summary.",
                        category: "RFQ",
                        modifiedDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 882:
            msgobj = {
                messageBuildNumber: 883,
                developer: "Shirish",
                message: [
                    {
                        messageCode: "RFQ10006",
                        messageKey: "MANUAL_PRICING_SAVE",
                        messageType: "Success",
                        message: "Pricing is saved successfully.",
                        category: "RFQ",
                        modifiedDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 883:
            msgobj = {
                messageBuildNumber: 884,
                developer: "Shirish",
                message: [
                    {
                        messageCode: "RFQ10007",
                        messageKey: "MANUAL_PRICING_UPDATE",
                        messageType: "Success",
                        message: "Pricing is updated successfully.",
                        category: "RFQ",
                        modifiedDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 884:
            msgobj = {
                messageBuildNumber: 885,
                developer: "Shirish",
                message: [
                    {
                        messageCode: "RFQ10008",
                        messageKey: "RESET_PRICING",
                        messageType: "Success",
                        message: "Pricing reset successfully.",
                        category: "RFQ",
                        modifiedDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;


        case 885:
            msgobj = {
                messageBuildNumber: 886,
                developer: "Dharmesh",
                message: [
                    {
                        messageCode: "RCV40053",
                        messageKey: "SQ_STATUS_CHANGE",
                        messageType: "Confirmation",
                        message: "Supplier quote status will be changed from {0} to {1}, Press Yes to Continue.",
                        category: "RECEIVING",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;


        case 886:
            msgobj = {
                messageBuildNumber: 887,
                developer: "Dharmesh",
                message: [
                    {
                        messageCode: "RCV20166",
                        messageKey: "PART_ALREADY_EXIST_IN_SAME_SUPPLIER_QUOTE",
                        messageType: "Error",
                        message: "<b>{0}</b> is already exist in Quote#<b>{1}</b>.",
                        category: "RECEIVING",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;

        case 887:
            msgobj = {
                messageBuildNumber: 888,
                developer: "Dharmesh",
                message: [
                    {
                        messageCode: "RCV50031",
                        messageKey: "SUPPLIER_QUOTE_STATUS_CHANGE",
                        messageType: "Information",
                        message: "In prior to publish supplier quote, you must have to fill up all required details of supplier quote.",
                        category: "RECEIVING",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;

        case 888:
            msgobj = {
                messageBuildNumber: 889,
                developer: "Dharmesh",
                message: [
                    {
                        messageCode: "RCV20167",
                        messageKey: "PRICING_ADDED_FOR_ATTRIBUTE",
                        messageType: "Error",
                        message: "You cannot remove <b>{0}</b> as pricing detail added.",
                        category: "RECEIVING",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;



        case 889:
            msgobj = {
                messageBuildNumber: 890,
                developer: "Dharmesh",
                message: [
                    {
                        messageCode: "RFQ40014",
                        messageKey: "DELETE_QUOTE_ATTRIBUTE_MSG",
                        messageType: "Confirmation",
                        message: "Are you Sure want to remove <b>{0}</b> quote attribute from this Quote.<br/> Press Yes to continue.",
                        category: "RFQ",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;


        case 890:
            msgobj = {
                messageBuildNumber: 891,
                developer: "Dharmesh",
                message: [
                    {
                        messageCode: "RCV20168",
                        messageKey: "ITEM_NUMBER_DUPLICATE",
                        messageType: "Error",
                        message: "Item# <b>{0}</b> must be unique.",
                        category: "RECEIVING",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;


        case 891:
            msgobj = {
                messageBuildNumber: 892,
                developer: "Dharmesh",
                message: [
                    {
                        messageCode: "RCV20169",
                        messageKey: "PRICING_REQUIRED_FIELDS",
                        messageType: "Error",
                        message: "Please enter data for required fields.",
                        category: "RECEIVING",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 892:
            msgobj = {
                messageBuildNumber: 893,
                developer: "Shweta",
                message: [
                    {
                        messageCode: "GLB50023",
                        messageKey: "CUSTOM_FORM_STATUS_CHANGE_NOTIFICATION",
                        messageType: "Information",
                        message: "Custom form <b>{0}</b> status changed {1} to {2}.",
                        category: "GLOBAL",
                        modifiedDate: new Date(COMMON.getCurrentUTC()),
                        action: "U"
                    }
                ]
            };
            break;
        case 893:
            msgobj = {
                messageBuildNumber: 894,
                developer: "Jignesh",
                message: [
                    {
                        messageCode: "MST50035",
                        messageKey: "MISMATCH_REF_ATTRIBUTE_TYPE",
                        messageType: "Information",
                        message: "Attribute Type is mismatched with ref attribute type please check.",
                        category: "MASTER",
                        modifiedDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 894:
            msgobj = {
                messageBuildNumber: 895,
                developer: "Ketan",
                message: [
                    {
                        messageCode: "MFG20024",
                        messageKey: "CHECK_DESIGNATOR_ADDED_PREPROG_PART",
                        messageType: "Error",
                        message: "You have entered invalid part count. <br>Allowed to remove maximum part count \"{0}\" <br>Entered part count \"{1}\".",
                        category: "MFG",
                        modifiedDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 895:
            msgobj = {
                messageBuildNumber: 896,
                developer: "Ketan",
                message: [
                    {
                        messageCode: "MFG50022",
                        messageKey: "PREPROG_DESIGANTOR_ALREADY_IN_USED_FOR_TOTAL",
                        messageType: "Information",
                        message: "Pre-Programming part count of designator \"{0}\" is already existed. So you cannot update it.",
                        category: "MFG",
                        modifiedDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 896:
            msgobj = {
                messageBuildNumber: 897,
                developer: "Ketan",
                message: [
                    {
                        messageCode: "MFG50023",
                        messageKey: "PREPROG_DESIGANTOR_ALREADY_IN_USED_FOR_CURRENT",
                        messageType: "Information",
                        message: "Pre-Programming part count of designator \"{0}\" is already existed. To update it, first remove the current part count.",
                        category: "MFG",
                        modifiedDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 897:
            msgobj = {
                messageBuildNumber: 898,
                developer: "Ketan",
                message: [
                    {
                        messageCode: "MFG50024",
                        messageKey: "ADD_REMOVE_PREPROG_PART_COUNT_NOTE",
                        messageType: "Information",
                        message: "Enter part count and press enter. <br>e.g. To Add part: 5 or +5 , <br>To Remove part: -5.",
                        category: "MFG",
                        modifiedDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 898:
            msgobj = {
                messageBuildNumber: 899,
                developer: "Ashish",
                message: [
                    {
                        messageCode: "MST20064",
                        messageKey: "CALIBRATION_DATE_AND_CALIBRATION_EXPIRATION_DATE_VALIDATION",
                        messageType: "Error",
                        message: "Calibration Date must be less than Calibration Expiration Date.",
                        category: "MASTER",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 899:
            msgobj = {
                messageBuildNumber: 900,
                developer: "Champak",
                message: [
                    {
                        messageCode: "MFG50025",
                        messageKey: "CUSTOMER_PACKING_STATUS_CHANGE",
                        messageType: "Information",
                        message: "In prior to publish customer packing slip, you must have to fill up shipping details.",
                        category: "MFG",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 900:
            msgobj = {
                messageBuildNumber: 901,
                developer: "Champak",
                message: [
                    {
                        messageCode: "MFG40010",
                        messageKey: "CP_STATUS_CHANGE",
                        messageType: "Confirmation",
                        message: "Customer packing slip status will be changed from {0} to {1}, Press Yes to Continue.",
                        category: "MFG",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 901:
            msgobj = {
                messageBuildNumber: 902,
                developer: "Champak",
                message: [
                    {
                        messageCode: "MFG20025",
                        messageKey: "CUSTOMER_PACKING_SHIP_ALERT",
                        messageType: "Error",
                        message: "Please add Ship To detail.",
                        category: "MFG",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 902:
            msgobj = {
                messageBuildNumber: 903,
                developer: "Champak",
                message: [
                    {
                        messageCode: "MFG40011",
                        messageKey: "CUSTOMER_PACKINGTYPE_CONFIRMATION",
                        messageType: "Confirmation",
                        message: "All entered details will be lost, Are you sure want to continue?. Press Yes to Continue.",
                        category: "MFG",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 903:
            msgobj = {
                messageBuildNumber: 904,
                developer: "Shweta",
                message: [
                    {
                        messageCode: "GLB40024",
                        messageKey: "LOGOUT_ALERT",
                        messageType: "Confirmation",
                        message: "Assigned work order operation(s) is not completed yet, do you want to logout? <br/> {0} to check active operation list.",
                        category: "GLOBAL",
                        modifiedDate: new Date(COMMON.getCurrentUTC()),
                        action: "U"
                    }
                ]
            };
            break;
        case 904:
            msgobj = {
                messageBuildNumber: 905,
                developer: "Shubham",
                message: [
                    {
                        messageCode: "RPT20001",
                        messageKey: "ACTIVITY_ALREADY_STARTED",
                        messageType: "Error",
                        message: "Activity already started at {1} by {0}.",
                        category: "REPORT",
                        modifiedDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 905:
            msgobj = {
                messageBuildNumber: 906,
                developer: "Shubham",
                message: [
                    {
                        messageCode: "RPT10001",
                        messageKey: "STOP_ACTIVITY_SUCCESS",
                        messageType: "Success",
                        message: "Activity stopped successfully.",
                        category: "REPORT",
                        modifiedDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 905:
            msgobj = {
                messageBuildNumber: 906,
                developer: "Shubham",
                message: [
                    {
                        messageCode: "RPT20002",
                        messageKey: "DYNAMIC_REPORT_DELETE_MESSAGE",
                        messageType: "Error",
                        message: "Activity has been started for {0} Report. You cannot delete it.",
                        category: "REPORT",
                        modifiedDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 906:
            msgobj = {
                messageBuildNumber: 907,
                developer: "Dharmesh",
                message: [
                    {
                        messageCode: "RFQ40014",
                        messageKey: "DELETE_QUOTE_ATTRIBUTE_MSG",
                        messageType: "Confirmation",
                        message: "Are you sure want to remove <b>{0}</b> quote attribute from this Quote.<br/> Press Yes to continue.",
                        category: "RFQ",
                        modifiedDate: new Date(COMMON.getCurrentUTC()),
                        action: "U"
                    }
                ]
            };
            break;
        case 907:
            msgobj = {
                messageBuildNumber: 908,
                developer: "Ketan",
                message: [
                    {
                        messageCode: "MFG50023",
                        messageKey: "PREPROG_DESIGANTOR_ALREADY_IN_USED_FOR_CURRENT",
                        messageType: "Information",
                        message: "Part count already added in \"{0}\" designator. To {1} designator, first remove the current part count.",
                        category: "MFG",
                        modifiedDate: new Date(COMMON.getCurrentUTC()),
                        action: "U"
                    }
                ]
            };
            break;
        case 908:
            msgobj = {
                messageBuildNumber: 909,
                developer: "Ketan",
                message: [
                    {
                        messageCode: "MFG20026",
                        messageKey: "WO_PREPROG_DESIGNATOR_EXISTS",
                        messageType: "Error",
                        message: "\"{0}\" designator already exists for \"{1}\" part.",
                        category: "MFG",
                        modifiedDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 909:
            msgobj = {
                messageBuildNumber: 910,
                developer: "Ashish",
                message: [
                    {
                        messageCode: "MST20064",
                        messageKey: "CALIBRATION_DATE_AND_CALIBRATION_EXPIRATION_DATE_VALIDATION",
                        messageType: "Error",
                        message: "Calibration Expiration Date must be greater than Calibration Date.",
                        category: "MASTER",
                        modifiedDate: new Date(COMMON.getCurrentUTC()),
                        action: "U"
                    }
                ]
            };
            break;
        case 910:
            msgobj = {
                messageBuildNumber: 911,
                developer: "Ashish",
                message: [
                    {
                        messageCode: "MST20065",
                        messageKey: "CALBRATION_NOT_ALLOWED_FOR_OUT_OF_SERVICE_EQUIPMENT",
                        messageType: "Error",
                        message: "Calibration not allowed for out of service equipment/workstation.",
                        category: "MASTER",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 911:
            msgobj = {
                messageBuildNumber: 912,
                developer: "Dharmesh",
                message: [{
                    messageCode: "GLB40025",
                    messageKey: "DELETE_ROW_CONFIRMATION_MESSAGE",
                    messageType: "Error",
                    message: "Are you sure you want to remove selected row(s)? This action cannot be undone once saved.",
                    category: "GLOBAL",
                    createdDate: new Date(COMMON.getCurrentUTC()),
                    action: "I"
                }]
            };
            break;

        case 912:
            msgobj = {
                messageBuildNumber: 913,
                developer: "Dharmesh",
                message: [{
                    messageCode: "RCV20154",
                    messageKey: "EQUIPMENT_NOT_SCAN",
                    messageType: "Error",
                    message: "You cannot transfer UMID to Equipment Bin.",
                    category: "RECEIVING",
                    modifiedDate: new Date(COMMON.getCurrentUTC()),
                    action: "U"
                }]
            };
            break;
        case 913:
            msgobj = {
                messageBuildNumber: 914,
                developer: "Shirish",
                message: [
                    {
                        messageCode: "RFQ50015",
                        messageKey: "WITHOUT_SAVING_ALERT_BODY_MESSAGE_ACTIVITY",
                        messageType: "Confirmation",
                        message: "You will lose all unsaved work.<br/> Are you sure you want to {0} activity?",
                        category: "RFQ",
                        modifiedDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 914:
            msgobj = {
                messageBuildNumber: 915,
                developer: "Shirish",
                message: [
                    {
                        messageCode: "RFQ10009",
                        messageKey: "COSTING_ACTIVITY",
                        messageType: "Success",
                        message: "Costing Activity {0} successfully.",
                        category: "RFQ",
                        modifiedDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 915:
            msgobj = {
                messageBuildNumber: 916,
                developer: "Shirish",
                message: [
                    {
                        messageCode: "RFQ10010",
                        messageKey: "COSTING_ACTIVITY_AL",
                        messageType: "Success",
                        message: "Already {0} Costing Activity, Please reload page.",
                        category: "RFQ",
                        modifiedDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 916:
            msgobj = {
                messageBuildNumber: 917,
                developer: "Shirish",
                message: [
                    {
                        messageCode: "RFQ50018",
                        messageKey: "START_STOP_COSTING_ACTIVITY_TEXT",
                        messageType: "Information",
                        message: "Current costing activity {0} by {1}.",
                        category: "RFQ",
                        modifiedDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 917:
            msgobj = {
                messageBuildNumber: 918,
                developer: "Shirish",
                message: [
                    {
                        messageCode: "RFQ40016",
                        messageKey: "COSTING_STOP_FROM_RFQ_LIST_MESSAGE",
                        messageType: "Confirmation",
                        message: "Costing activity will be stop for assembly <b>{0}</b>. Are you sure want to continue?",
                        category: "RFQ",
                        modifiedDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 918:
            msgobj = {
                messageBuildNumber: 919,
                developer: "Shirish",
                message: [
                    {
                        messageCode: "RFQ40017",
                        messageKey: "COSTING_STOP_BY_SA_FROM_RFQ_LIST_MESSAGE",
                        messageType: "Confirmation",
                        message: "Are you sure you want to stop the <b>{0}</b> User Costing activity of <b>{1}</b>?<br/><b>{2}</b> User active session unsaved work will autosave if any. Press yes to continue.",
                        category: "RFQ",
                        modifiedDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 919:
            msgobj = {
                messageBuildNumber: 920,
                developer: "Shirish",
                message: [
                    {
                        messageCode: "RFQ20007",
                        messageKey: "COSTING_DIFFERENT_USER_STOP_MESSAGE",
                        messageType: "Error",
                        message: "You cannot stop the costing activity of different user, Please contact to <b>{0}</b>.",
                        category: "RFQ",
                        modifiedDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 920:
            msgobj = {
                messageBuildNumber: 921,
                developer: "Champak",
                message: [
                    {
                        messageCode: "MFG20027",
                        messageKey: "CUSTOMER_PACKING_SLIP_REQUIRED_VALIDATION",
                        messageType: "Error",
                        message: "Please add shipment Qty.",
                        category: "MFG",
                        modifiedDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 921:
            msgobj = {
                messageBuildNumber: 922,
                developer: "Champak",
                message: [
                    {
                        messageCode: "MFG50026",
                        messageKey: "CUSTOMER_PACKING_SLIP_ADDRESS_SHIPPING_MISMATCH",
                        messageType: "Information",
                        message: "You cannot add shipping details because selected packing slip shipping address or shipping method does not match with default ship to address or shipping method.",
                        category: "MFG",
                        modifiedDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 922:
            msgobj = {
                messageBuildNumber: 923,
                developer: "Champak",
                message: [
                    {
                        messageCode: "MFG50026",
                        messageKey: "CUSTOMER_PACKING_SLIP_ADDRESS_SHIPPING_MISMATCH",
                        messageType: "Information",
                        message: "You cannot add shipping details because selected packing slip shipping address or shipping method does not match with default ship to address or shipping method.",
                        category: "MFG",
                        modifiedDate: new Date(COMMON.getCurrentUTC()),
                        action: "U"
                    }
                ]
            };
            break;
        case 923:
            msgobj = {
                messageBuildNumber: 924,
                developer: "Fenil",
                message: [
                    {
                        messageCode: "RCV20164",
                        messageKey: "PS_RECEIVED_STATUS_NOT_ALLOW_INVOICE_DETAIL",
                        messageType: "Error",
                        message: "Received status of packing slip line# <b>{0}</b> is <b>{1}</b> so you cannot change invoice line detail.",
                        category: "RECEIVING",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "U"
                    }
                ]
            };
            break;
        case 924:
            msgobj = {
                messageBuildNumber: 925,
                developer: "Fenil",
                message: [
                    {
                        messageCode: "RCV20162",
                        messageKey: "REMARK_MAX_LENGTH",
                        messageType: "Error",
                        message: "Remark does not accept more than {0} character.",
                        category: "RECEIVING",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 925:
            msgobj = {
                messageBuildNumber: 926,
                developer: "Dharmesh",
                message: [{
                    messageCode: "GLB40025",
                    messageKey: "DELETE_ROW_CONFIRMATION_MESSAGE",
                    messageType: "Confirmation",
                    message: "Are you sure you want to remove selected row(s)? This action cannot be undone once saved.",
                    category: "GLOBAL",
                    modifiedDate: new Date(COMMON.getCurrentUTC()),
                    action: "U"
                }]
            };
            break;

        case 926:
            msgobj = {
                messageBuildNumber: 927,
                developer: "Dharmesh",
                message: [{
                    messageCode: "RCV50032",
                    messageKey: "SUPPLIER_QUOTE_PART_ATTRIBUTE_REMOVED",
                    messageType: "Information",
                    message: "Attribute(s) <b>{0}</b> has been removed by <b>{1}</b>. Your attribute(s) will be removed from pricing detail.",
                    category: "RECEIVING",
                    createdDate: new Date(COMMON.getCurrentUTC()),
                    action: "I"
                }]
            };
            break;
        case 927:
            msgobj = {
                messageBuildNumber: 928,
                developer: "Ketan",
                message: [{
                    messageCode: "MFG20028",
                    messageKey: "COMPONENT_DESIGANTOR_LIMIT_EXITS",
                    messageType: "Error",
                    message: "Part should not be allowed more than total QPA count.",
                    category: "MFG",
                    createdDate: new Date(COMMON.getCurrentUTC()),
                    action: "I"
                }]
            };
            break;

        case 928:
            msgobj = {
                messageBuildNumber: 929,
                developer: "Champak",
                message: [{
                    messageCode: "RFQ50019",
                    messageKey: "CUSTOM_PRICEBREAK_ALERT",
                    messageType: "Information",
                    message: "Entered {0} is not exist in price break list. Please enter valid {1}.",
                    category: "RFQ",
                    createdDate: new Date(COMMON.getCurrentUTC()),
                    action: "I"
                }]
            };
            break;
        case 929:
            msgobj = {
                messageBuildNumber: 930,
                developer: "Champak",
                message: [{
                    messageCode: "RFQ50019",
                    messageKey: "CUSTOM_PRICEBREAK_ALERT",
                    messageType: "Information",
                    message: "Entered {0} is not exist for quantity {1} in price break list. Please enter valid {2}.",
                    category: "RFQ",
                    createdDate: new Date(COMMON.getCurrentUTC()),
                    action: "U"
                }]
            };
            break;
        case 930:
            msgobj = {
                messageBuildNumber: 931,
                developer: "Shweta",
                message: [
                    {
                        messageCode: "GLB50023",
                        messageKey: "CUSTOM_FORM_STATUS_CHANGE_NOTIFICATION",
                        messageType: "Information",
                        message: "Custom form <b>{0}</b> status changed {1} to {2} by {3}.",
                        category: "GLOBAL",
                        modifiedDate: new Date(COMMON.getCurrentUTC()),
                        action: "U"
                    }
                ]
            };
            break;
        case 931:
            msgobj = {
                messageBuildNumber: 932,
                developer: "Champak",
                message: [{
                    messageCode: "RFQ50020",
                    messageKey: "CLEAR_PRICE_ALERT",
                    messageType: "Information",
                    message: "You cannot remove price for selected line item <b>{0}</b> as no price selected for line item <b>{0}</b>.",
                    category: "RFQ",
                    createdDate: new Date(COMMON.getCurrentUTC()),
                    action: "I"
                }]
            };
            break;
        case 932:
            msgobj = {
                messageBuildNumber: 933,
                developer: "Champak",
                message: [{
                    messageCode: "RFQ40018",
                    messageKey: "CLEAR_PRICE_CONFIRMATION",
                    messageType: "Confirmation",
                    message: "Are you sure you want to clear price for line item <b>{0}</b>. Press yes to continue.",
                    category: "RFQ",
                    createdDate: new Date(COMMON.getCurrentUTC()),
                    action: "I"
                }]
            };
            break;
        case 933:
            msgobj = {
                messageBuildNumber: 934,
                developer: "Dharmesh",
                message: [{
                    messageCode: "RCV20170",
                    messageKey: "CANNOT_DELETE_PRICINGLINE",
                    messageType: "Error",
                    message: "You cannot delete line(s) as it is used in part costing.",
                    category: "RECEIVING",
                    createdDate: new Date(COMMON.getCurrentUTC()),
                    action: "I"
                }]
            };
            break;
        case 934:
            msgobj = {
                messageBuildNumber: 935,
                developer: "Ketan",
                message: [{
                    messageCode: "MFG20029",
                    messageKey: "PROCESS_SETUP_TIME_NOT_MORE_THAN_TOTAL",
                    messageType: "Error",
                    message: "Process setup time should not be more than total process time.",
                    category: "MFG",
                    createdDate: new Date(COMMON.getCurrentUTC()),
                    action: "I"
                }]
            };
            break;
        case 935:
            msgobj = {
                messageBuildNumber: 936,
                developer: "Ketan",
                message: [{
                    messageCode: "MFG20030",
                    messageKey: "PROCESS_QTY_NOT_VALID",
                    messageType: "Error",
                    message: "You don't have sufficient stock to stop operation activity!",
                    category: "MFG",
                    createdDate: new Date(COMMON.getCurrentUTC()),
                    action: "I"
                }]
            };
            break;
        case 936:
            msgobj = {
                messageBuildNumber: 937,
                developer: "Ketan",
                message: [{
                    messageCode: "MFG10001",
                    messageKey: "OPERATION_CHECK_OUT",
                    messageType: "Success",
                    message: "Operation: Activity stopped successfully.",
                    category: "MFG",
                    createdDate: new Date(COMMON.getCurrentUTC()),
                    action: "I"
                }]
            };
            break;
        case 937:
            msgobj = {
                messageBuildNumber: 938,
                developer: "Ketan",
                message: [{
                    messageCode: "MFG50027",
                    messageKey: "FROM_QTY_NOT_MORE_THAN_TO_QTY",
                    messageType: "Information",
                    message: "{0} quantity should not be more than {1} quantity.",
                    category: "MFG",
                    createdDate: new Date(COMMON.getCurrentUTC()),
                    action: "I"
                }]
            };
            break;
        case 938:
            msgobj = {
                messageBuildNumber: 939,
                developer: "Ketan",
                message: [{
                    messageCode: "MFG50028",
                    messageKey: "OPERATION_ALREADY_STOPPED",
                    messageType: "Information",
                    message: "<b>{0}</b> operation activity is stopped by administrator. Please contact to administrator.",
                    category: "MFG",
                    createdDate: new Date(COMMON.getCurrentUTC()),
                    action: "I"
                }]
            };
            break;
        case 939:
            msgobj = {
                messageBuildNumber: 940,
                developer: "Ketan",
                message: [{
                    messageCode: "MFG20031",
                    messageKey: "EMP_ALREADY_WORKING_ON_OPERATION",
                    messageType: "Error",
                    message: "Personnel is already working on the same operation with different team!",
                    category: "MFG",
                    createdDate: new Date(COMMON.getCurrentUTC()),
                    action: "I"
                }]
            };
            break;
        case 940:
            msgobj = {
                messageBuildNumber: 941,
                developer: "Ketan",
                message: [{
                    messageCode: "MFG40012",
                    messageKey: "REWORK_CASE_VALID_QTY_CONFIRM",
                    messageType: "Confirmation",
                    message: "Are you sure this quantity for rework operation?",
                    category: "MFG",
                    createdDate: new Date(COMMON.getCurrentUTC()),
                    action: "I"
                }]
            };
            break;
        case 941:
            msgobj = {
                messageBuildNumber: 942,
                developer: "Ketan",
                message: [{
                    messageCode: "MFG40013",
                    messageKey: "START_OPERATION_CONFIRM",
                    messageType: "Confirmation",
                    message: "To start operation activity <b>{0}</b>, Press Yes to Continue.",
                    category: "MFG",
                    createdDate: new Date(COMMON.getCurrentUTC()),
                    action: "I"
                }]
            };
            break;
        case 942:
            msgobj = {
                messageBuildNumber: 943,
                developer: "Ketan",
                message: [{
                    messageCode: "MFG10002",
                    messageKey: "ACTIVITY_STARTED_WO_OP_COMMON",
                    messageType: "Success",
                    message: "{0}: Activity started successfully.",
                    category: "MFG",
                    createdDate: new Date(COMMON.getCurrentUTC()),
                    action: "I"
                }]
            };
            break;
        case 943:
            msgobj = {
                messageBuildNumber: 944,
                developer: "Ketan",
                message: [{
                    messageCode: "MFG10003",
                    messageKey: "ACTIVITY_STOPPED_WO_OP_COMMON",
                    messageType: "Success",
                    message: "{0}: Activity stopped successfully.",
                    category: "MFG",
                    createdDate: new Date(COMMON.getCurrentUTC()),
                    action: "I"
                }]
            };
            break;
        case 944:
            msgobj = {
                messageBuildNumber: 945,
                developer: "Fenil",
                message: [
                    {
                        messageCode: "RCV20172",
                        messageKey: "EXISTING_STK_COUNT_NOT_MORE_THAN_SPQ",
                        messageType: "Error",
                        message: "</b>Count</b> could not be more than </b>SPQ</b> when packaging is </b>Tape & Reel</b>.",
                        category: "RECEIVING",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 945:
            msgobj = {
                messageBuildNumber: 946,
                developer: "Ketan",
                message: [
                    {
                        messageCode: "MFG10004",
                        messageKey: "WO_OP_PAUSED_SUCCESS_COMMON",
                        messageType: "Success",
                        message: "{0} is paused.",
                        category: "MFG",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 946:
            msgobj = {
                messageBuildNumber: 947,
                developer: "Ketan",
                message: [
                    {
                        messageCode: "MFG10005",
                        messageKey: "WO_OP_RESUMED_SUCCESS_COMMON",
                        messageType: "Success",
                        message: "{0} is resumed.",
                        category: "MFG",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 947:
            msgobj = {
                messageBuildNumber: 948,
                developer: "Ketan",
                message: [
                    {
                        messageCode: "MFG50029",
                        messageKey: "START_ACTIVITY_PAUSE_OTHER_OPERATION",
                        messageType: "Information",
                        message: "{0} will pause all below operation activities except parallel operation of same work order.",
                        category: "MFG",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 948:
            msgobj = {
                messageBuildNumber: 949,
                developer: "Ketan",
                message: [
                    {
                        messageCode: "MFG40014",
                        messageKey: "PAUSE_OP_FOR_ALL_EMP_CONFIRM",
                        messageType: "Confirmation",
                        message: "Want to make operation in pause mode for working personnel?",
                        category: "MFG",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 949:
            msgobj = {
                messageBuildNumber: 950,
                developer: "Ketan",
                message: [
                    {
                        messageCode: "MFG40015",
                        messageKey: "WO_OP_RESUME_ACTIVITY_CONFIRM",
                        messageType: "Confirmation",
                        message: "Are you sure you want to resume activity?",
                        category: "MFG",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 950:
            msgobj = {
                messageBuildNumber: 951,
                developer: "Ketan",
                message: [
                    {
                        messageCode: "MFG40015",
                        messageKey: "WO_OP_RESUME_ACTIVITY_CONFIRM",
                        messageType: "Confirmation",
                        message: "Are you sure you want to {0}?",
                        category: "MFG",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "U"
                    }
                ]
            };
            break;

        case 951:
            msgobj = {
                messageBuildNumber: 952,
                developer: 'Dharmesh',
                message: [{
                    messageCode: 'MST40034',
                    messageKey: 'DELETE_TEMPLATE_ATTRIBUTE_CONFIRMATION',
                    messageType: 'Confirmation',
                    message: 'Are you sure want to remove <b>{0}</b> attribute from this template.<br/> Press Yes to continue.',
                    category: 'MASTER',
                    createdDate: new Date(COMMON.getCurrentUTC()),
                    action: 'I'
                }]
            };
            break;



        case 952:
            msgobj = {
                messageBuildNumber: 953,
                developer: "Dharmesh",
                message: [{
                    messageCode: 'RCV40055',
                    messageKey: 'DELETE_PRICING_ROW_CONFIRMATION_MESSAGE',
                    messageType: 'Confirmation',
                    message: 'You are making changes in pricing and supplier quote price does not used in RFQ part costing, system will remove all details from part costing of this quote assembly, you have to re-fetch again if you are required to use.<br/> Are you sure you want to remove selected row(s)?',
                    category: 'RECEIVING',
                    createdDate: new Date(COMMON.getCurrentUTC()),
                    action: 'I'
                }]
            };
            break;

        case 953:
            msgobj = {
                messageBuildNumber: 954,
                developer: "Dharmesh",
                message: [{
                    messageCode: 'RCV50033',
                    messageKey: 'PRICING_SAVE_INFORMATION',
                    messageType: 'Information',
                    message: 'Please save {0} details before {1} negotiate price.',
                    category: 'RECEIVING',
                    createdDate: new Date(COMMON.getCurrentUTC()),
                    action: 'I'
                }]
            };
            break;


        case 954:
            msgobj = {
                messageBuildNumber: 955,
                developer: "Dharmesh",
                message: [{
                    messageCode: 'RCV20173',
                    messageKey: 'SUPPLIER_QUOTE_PUBLISHED',
                    messageType: 'ERROR',
                    message: 'You cannot {0} as supplier quote is in published state.',
                    category: 'RECEIVING',
                    createdDate: new Date(COMMON.getCurrentUTC()),
                    action: 'I'
                }]
            };
            break;


        case 955:
            msgobj = {
                messageBuildNumber: 956,
                developer: "Dharmesh",
                message: [{
                    messageCode: 'RCV20174',
                    messageKey: 'PRICING_USED_IN_PART_COSTING',
                    messageType: 'ERROR',
                    message: 'You cannot {0} pricing details as it is used in part costing of this quote assembly.',
                    category: 'RECEIVING',
                    createdDate: new Date(COMMON.getCurrentUTC()),
                    action: 'I'
                }]
            };
            break;

        case 956:
            msgobj = {
                messageBuildNumber: 957,
                developer: "Dharmesh",
                message: [{
                    messageCode: 'RCV20174',
                    messageKey: 'SUPPLIER_QUOTE_PUBLISHED_DELETE',
                    messageType: 'ERROR',
                    message: 'You cannot delete Quote# <b>{0}</b> as supplier quote(s) is in published state.',
                    category: 'RECEIVING',
                    createdDate: new Date(COMMON.getCurrentUTC()),
                    action: 'I'
                }]
            };
            break;
        case 957:
            msgobj = {
                messageBuildNumber: 958,
                developer: 'Jignesh',
                message: [
                    {
                        messageCode: 'RFQ40019',
                        messageKey: 'BOM_KIT_ALLOCATION_REQUIRED_CONFIRAMTION',
                        messageType: 'Confirmation',
                        message: 'Are you sure you want to allocate selected line Item to required in Kit allocation ?',
                        category: 'RFQ',
                        modifiedDate: new Date(COMMON.getCurrentUTC()),
                        action: 'I'
                    }
                ]
            };
            break;
        case 958:
            msgobj = {
                messageBuildNumber: 959,
                developer: 'Ketan',
                message: [
                    {
                        messageCode: 'MFG20034',
                        messageKey: 'PREV_WO_OP_NOT_CONTAIN_FIRST_ARTICLE_SERIAL',
                        messageType: 'Error',
                        message: '{0} serial# not exists in above all previous operations. Please scan valid serial#.',
                        category: 'MFG',
                        modifiedDate: new Date(COMMON.getCurrentUTC()),
                        action: 'I'
                    }
                ]
            };
            break;
        case 959:
            msgobj = {
                messageBuildNumber: 960,
                developer: 'Ketan',
                message: [
                    {
                        messageCode: 'MFG50030',
                        messageKey: 'FIRST_ARTICLE_SERIAL_ALREADY_ADDED_NOTE',
                        messageType: 'Information',
                        message: 'Note: Below serial# already exists in current operation.',
                        category: 'MFG',
                        modifiedDate: new Date(COMMON.getCurrentUTC()),
                        action: 'I'
                    }
                ]
            };
            break;
        case 960:
            msgobj = {
                messageBuildNumber: 961,
                developer: "Ashish",
                message: [
                    {
                        messageCode: "PRT20033",
                        messageKey: "PART_UPDATE_VALIDATION_DUE_TO_BOM_ACTIVITY_STARTED",
                        messageType: "Error",
                        message: "Part is not allowed to update as BOM activity is going on for the assembly, please stop the BOM activity first then try again.",
                        category: "PARTS",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 961:
            msgobj = {
                messageBuildNumber: 962,
                developer: "Shweta",
                message: [{
                    messageCode: "MFG20032",
                    messageKey: "PART_MUST_BE_OTHER_THAN_SMT",
                    messageType: "Error",
                    message: "Part belongs to mounting group category <b>{0}</b>.",
                    category: "MFG",
                    createdDate: new Date(COMMON.getCurrentUTC()),
                    action: "I"
                }]
            };
            break;
        case 962:
            msgobj = {
                messageBuildNumber: 963,
                developer: "Shweta",
                message: [{
                    messageCode: "MFG20033",
                    messageKey: "UPDATE_SALES_DETAIL_WITH_KIT_RELEASE",
                    messageType: "Error",
                    message: "Sales Order details can not be {0} work order as kit already released.",
                    category: "MFG",
                    createdDate: new Date(COMMON.getCurrentUTC()),
                    action: "I"
                }]
            };
            break;
        case 963:
            msgobj = {
                messageBuildNumber: 964,
                developer: "Shirish",
                message: [
                    {
                        messageCode: "RFQ20008",
                        messageKey: "INVALID_PROGRAMMING_BUY_DNP_MAPPING",
                        messageType: "Error",
                        message: "Invalid mapping for programming status with buy DNP qty status in current BOM.Please Check.",
                        category: "RFQ",
                        modifiedDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 964:
            msgobj = {
                messageBuildNumber: 965,
                developer: "Shirish",
                message: [
                    {
                        messageCode: "RFQ50021",
                        messageKey: "BOM_SAVE_CHANGES_CONFIRMATION",
                        messageType: "Information",
                        message: "You have some unsaved work. Please save your work for get change effect.",
                        category: "RFQ",
                        modifiedDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 965:
            msgobj = {
                messageBuildNumber: 966,
                developer: "Dharmesh",
                message: [{
                    messageCode: 'RCV20176',
                    messageKey: 'MFR_NOT_MAPPED_WITH_SUPPLIER',
                    messageType: 'ERROR',
                    message: 'This supplier is having strictly custom component setting, so we only allow the MFR which are already mapped to this supplier, and {0} MFR(s) <b>{1}</b> are not mapped to this supplier.',
                    category: 'RECEIVING',
                    createdDate: new Date(COMMON.getCurrentUTC()),
                    action: 'I'
                }]
            };
            break;
        case 966:
            msgobj = {
                messageBuildNumber: 967,
                developer: "Dharmesh",
                message: [{
                    messageCode: 'RCV20177',
                    messageKey: 'MAPPED_MFRPN_IS_NOT_CUSTOM_PART',
                    messageType: 'ERROR',
                    message: 'This supplier is having strictly custom component setting, so we only allow MFR PN whose MFR is already mapped and the part is custom part, and the {0} MFR PN <b>{1}</b> is not a custom part.',
                    category: 'RECEIVING',
                    createdDate: new Date(COMMON.getCurrentUTC()),
                    action: 'I'
                }]
            };
            break;
        case 967:
            msgobj = {
                messageBuildNumber: 968,
                developer: 'Dharmesh',
                message: [{
                    messageCode: 'MST40034',
                    messageKey: 'DELETE_TEMPLATE_ATTRIBUTE_CONFIRMATION',
                    messageType: 'Confirmation',
                    message: 'Are you sure you want to remove <b>{0}</b> attribute from this template.<br/> Press Yes to continue.',
                    category: 'MASTER',
                    modifiedDate: new Date(COMMON.getCurrentUTC()),
                    action: "U"
                }]
            };
            break;
        case 968:
            msgobj = {
                messageBuildNumber: 969,
                developer: "Dharmesh",
                message: [{
                    messageCode: 'RCV50033',
                    messageKey: 'PRICING_SAVE_INFORMATION',
                    messageType: 'Information',
                    message: 'Please save the {0} details before {1} price negotiation.',
                    category: 'RECEIVING',
                    modifiedDate: new Date(COMMON.getCurrentUTC()),
                    action: "U"
                }]
            };
            break;
        case 969:
            msgobj = {
                messageBuildNumber: 970,
                developer: "Shweta",
                message: [
                    {
                        messageCode: "MFG20035",
                        messageKey: "SCAN_MISSING_PART_KIT_NOT_RETURN",
                        messageType: "Error",
                        message: "You cannot scan missing material until kit is not returned for work order <b>{0}S</b>.",
                        category: "MFG",
                        modifiedDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 970:
            msgobj = {
                messageBuildNumber: 971,
                developer: "Shirish",
                message: [
                    {
                        messageCode: "RFQ20009",
                        messageKey: "DUPLICATE_REF_DES_MAPPING_NOT_ALLOWED",
                        messageType: "Error",
                        message: "Duplicate REF DESG mapping not allowed. Please apply unique mapping for program REF DES.",
                        category: "RFQ",
                        modifiedDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 971:
            msgobj = {
                messageBuildNumber: 972,
                developer: 'Champak',
                message: [
                    {
                        messageCode: 'MFG40016',
                        messageKey: 'CUSTOMER_INVOICE_STATUS_CHANGE',
                        messageType: 'Confirmation',
                        message: 'Are you sure to change customer invoice status from {0} to {1}? Once it is {1} it will not allow to change any details. Press Yes to Continue.',
                        category: 'MFG',
                        modifiedDate: new Date(COMMON.getCurrentUTC()),
                        action: 'I'
                    }
                ]
            };
            break;
        case 972:
            msgobj = {
                messageBuildNumber: 973,
                developer: 'Champak',
                message: [
                    {
                        messageCode: 'MFG20036',
                        messageKey: 'CUSTOMER_INVOICE_POLINE_NOTFOUND',
                        messageType: 'Error',
                        message: 'Invoice PO Line# not found in invoice detail.',
                        category: 'MFG',
                        modifiedDate: new Date(COMMON.getCurrentUTC()),
                        action: 'I'
                    }
                ]
            };
            break;
        case 973:
            msgobj = {
                messageBuildNumber: 974,
                developer: "Ashish",
                message: [
                    {
                        messageCode: "PRT50004",
                        messageKey: "COMPONENT_ASSEMBLY_REVISION_CREATED_MESSAGE",
                        messageType: "Information",
                        message: "Duplicate Part Created Successfully.",
                        category: "PARTS",
                        modifiedDate: new Date(COMMON.getCurrentUTC()),
                        action: "U"
                    }
                ]
            };
            break;
        case 974:
            msgobj = {
                messageBuildNumber: 975,
                developer: "Ashish",
                message: [
                    {
                        messageCode: "PRT40020",
                        messageKey: "COMPONENT_CREATE_ASSEMBLY_REVISION_CONFIRMATION_MESSAGE",
                        messageType: "Confirmation",
                        message: "Are you sure to create duplicate part? Press Yes to Continue.",
                        category: "PARTS",
                        modifiedDate: new Date(COMMON.getCurrentUTC()),
                        action: "U"
                    }
                ]
            };
            break;
        case 975:
            msgobj = {
                messageBuildNumber: 976,
                developer: "Shweta",
                message: [{
                    messageCode: "RCV50024",
                    messageKey: "INITIATE_KIT_RETURN_WO_STATUS_CHANGE",
                    messageType: "Information",
                    message: "To initiate return request workorder status must be <b>Completed</b> or <b>Terminated</b> or <b>Completed With Missing Part</b> for <b>WO# {0}</b>.",
                    category: "RECEIVING",
                    modifiedDate: new Date(COMMON.getCurrentUTC()),
                    action: "U"
                }]
            };
            break;
        case 976:
            msgobj = {
                messageBuildNumber: 977,
                developer: "Shubham",
                message: [{
                    messageCode: "GLB20014",
                    messageKey: "SELECTED_VALID_FILE",
                    messageType: "Error",
                    message: "Only <b>{0}</b> file(s) are selected to upload from <b>{1}</b> file(s), as there are some unsupported files are being selected to upload.",
                    category: "GLOBAL",
                    modifiedDate: new Date(COMMON.getCurrentUTC()),
                    action: "U"
                }]
            };
            break;
        case 977:
            msgobj = {
                messageBuildNumber: 978,
                developer: "Shubham",
                message: [{
                    messageCode: "GLB20018",
                    messageKey: "ALLOW_FILE_TO_UPLOAD",
                    messageType: "Error",
                    message: "Please check for unsupported file extensions from selected file(s): <br /><b>{0}</b> <br /> <br /> {1} to view all unsupported extensions",
                    category: "GLOBAL",
                    modifiedDate: new Date(COMMON.getCurrentUTC()),
                    action: "U"
                }]
            };
            break;
        case 978:
            msgobj = {
                messageBuildNumber: 979,
                developer: "Shubham",
                message: [{
                    messageCode: "GLB40027",
                    messageKey: "APPLY_DOCUMENT_CHANGES_ALERT_BODY_MESSAGE_ON_ZOOM",
                    messageType: "GLOBAL",
                    message: "You have made some changes in document, which are not applied yet.<br />Do you want to apply them and zoom it? Press Yes to Continue.",
                    category: "GLOBAL",
                    modifiedDate: new Date(COMMON.getCurrentUTC()),
                    action: "I"
                }]
            };
            break;
        case 979:
            msgobj = {
                messageBuildNumber: 980,
                developer: "Jignesh",
                message: [
                    {
                        messageCode: "RFQ50022",
                        messageKey: "QUOTE_SUMMARY_INVALID_VALUE",
                        messageType: "Information",
                        message: "You have enterd invalid entry. Please enter valid data.",
                        category: "RFQ",
                        modifiedDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 980:
            msgobj = {
                messageBuildNumber: 981,
                developer: "Shweta",
                message: [{
                    messageCode: "RCV50024",
                    messageKey: "INITIATE_KIT_RETURN_WO_STATUS_CHANGE",
                    messageType: "Information",
                    message: "To initiate return request workorder status must be <b>Completed</b> or <b>Completed With Missing Part</b> or <b>Terminated</b>  for <b>WO# {0}</b>.",
                    category: "RECEIVING",
                    modifiedDate: new Date(COMMON.getCurrentUTC()),
                    action: "U"
                }]
            };
            break;
        case 981:
            msgobj = {
                messageBuildNumber: 982,
                developer: "Jignesh",
                message: [
                    {
                        messageCode: "RFQ40020",
                        messageKey: "OVERHEAD_COST_MORE_THAN_MATERIAL_CONFIRAMTION",
                        messageType: "Confirmation",
                        message: "Are you sure you want to add overhead cost($) {0} is more than material cost($) {1}?",
                        category: "RFQ",
                        modifiedDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 982:
            msgobj = {
                messageBuildNumber: 983,
                developer: "Jignesh",
                message: [
                    {
                        messageCode: "RFQ40021",
                        messageKey: "COST_ATTRIBUTE_PERCENTAGE_MORE_THAN_100_CONFIRAMTION",
                        messageType: "Confirmation",
                        message: "Are you sure you want to save attribute percentage is more than 100?",
                        category: "RFQ",
                        modifiedDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 983:
            msgobj = {
                messageBuildNumber: 984,
                developer: "Ashish",
                message: [
                    {
                        messageCode: "PRT20034",
                        messageKey: "COMP_MULTIPLE_HYPHEN_IN_PID_CODE_NOT_ALLOWED",
                        messageType: "Error",
                        message: "Multiple -(Hyphens) are not allowed in PID together in sequence, please check and correct it.",
                        category: "PARTS",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 984:
            msgobj = {
                messageBuildNumber: 985,
                developer: "Shweta",
                message: [
                    {
                        messageCode: "MFG20037",
                        messageKey: "NO_DATA_FOUND_FOR_USAGE_DETAIL",
                        messageType: "Error",
                        message: "No documents attached in Packing Slip  or UMID for Material Usage Details",
                        category: "MFG",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 985:
            msgobj = {
                messageBuildNumber: 986,
                developer: "Charmi",
                message: [
                    {
                        messageCode: "GLB40015",
                        messageKey: "PUBLISH_TEMPLATE_CONFIRM",
                        messageType: "Confirmation",
                        message: "Are you sure? This action will publish current template and previous template will be set as read only. Press Yes to Continue. <br/> Note: You won't be able rollback this action, make sure template is ready to publish.",
                        category: "GLOBAL",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "U"
                    }
                ]
            };
            break;
        case 986:
            msgobj = {
                messageBuildNumber: 987,
                developer: 'Champak',
                message: [
                    {
                        messageCode: 'MFG20038',
                        messageKey: 'MISMATCH_AMOUNT',
                        messageType: 'Error',
                        message: 'Payment amount is mismatch with selected item total.',
                        category: 'MFG',
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: 'I'
                    }
                ]
            };
            break;
        case 987:
            msgobj = {
                messageBuildNumber: 988,
                developer: 'Champak',
                message: [
                    {
                        messageCode: 'MFG20039',
                        messageKey: 'NOT_PAID_INVOICE',
                        messageType: 'Error',
                        message: 'From selected records some records are not approved or already paid. Please check selected records.',
                        category: 'MFG',
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: 'I'
                    }
                ]
            };
            break;
        case 988:
            msgobj = {
                messageBuildNumber: 989,
                developer: 'Ketan',
                message: [
                    {
                        messageCode: 'MFG50031',
                        messageKey: 'WORKORDER_NUMBER_INVALID',
                        messageType: 'Information',
                        message: 'Work Order number must be valid.',
                        category: 'MFG',
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: 'I'
                    }
                ]
            };
            break;
        case 989:
            msgobj = {
                messageBuildNumber: 990,
                developer: 'Ketan',
                message: [
                    {
                        messageCode: 'MFG50032',
                        messageKey: 'SALESORDER_ALREADY_ADDED_UPDATE_QTY_IN_SAME',
                        messageType: 'Information',
                        message: 'Selected sales order details already added. For more quantity, have to update quantity in sales order detail only.',
                        category: 'MFG',
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: 'I'
                    }
                ]
            };
            break;
        case 990:
            msgobj = {
                messageBuildNumber: 991,
                developer: 'Ketan',
                message: [
                    {
                        messageCode: 'MFG50033',
                        messageKey: 'SCRAP_QTY_INVALID',
                        messageType: 'Information',
                        message: 'Scrapped quantity cannot more than work order total scrapped quantity.',
                        category: 'MFG',
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: 'I'
                    }
                ]
            };
            break;
        case 991:
            msgobj = {
                messageBuildNumber: 992,
                developer: 'Ketan',
                message: [
                    {
                        messageCode: 'MFG50034',
                        messageKey: 'PRODUCTION_STARTED_NOT_ALLOW_ANY_CHANGE_WO',
                        messageType: 'Information',
                        message: 'Production has started. You cannot change in work order.',
                        category: 'MFG',
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: 'I'
                    }
                ]
            };
            break;
        case 992:
            msgobj = {
                messageBuildNumber: 993,
                developer: 'Ketan',
                message: [
                    {
                        messageCode: 'MFG50035',
                        messageKey: 'WORKORDER_PUBLISHED_NOT_ALLOW_ANY_CHANGE',
                        messageType: 'Information',
                        message: 'You can change information only in case of work order status is "Draft" or "Published draft".',
                        category: 'MFG',
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: 'I'
                    }
                ]
            };
            break;
        case 993:
            msgobj = {
                messageBuildNumber: 994,
                developer: 'Ketan',
                message: [
                    {
                        messageCode: 'MFG50036',
                        messageKey: 'RESTRICTED_INCORRECT_PART',
                        messageType: 'Information',
                        message: 'Part is incorrect or TBD from part master level.',
                        category: 'MFG',
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: 'I'
                    }
                ]
            };
            break;
        case 994:
            msgobj = {
                messageBuildNumber: 995,
                developer: 'Ketan',
                message: [
                    {
                        messageCode: 'MFG50037',
                        messageKey: 'ASSEMBLY_MUST_HAVE_ROHS_STATUS',
                        messageType: 'Information',
                        message: 'Assembly must have RoHS status.',
                        category: 'MFG',
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: 'I'
                    }
                ]
            };
            break;
        case 995:
            msgobj = {
                messageBuildNumber: 996,
                developer: 'Ketan',
                message: [
                    {
                        messageCode: 'MFG50038',
                        messageKey: 'SAVE_SALESORDER_DETAILS_FIRST',
                        messageType: 'Information',
                        message: 'To save work order details, add sales order details first.',
                        category: 'MFG',
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: 'I'
                    }
                ]
            };
            break;
        case 996:
            msgobj = {
                messageBuildNumber: 997,
                developer: 'Ketan',
                message: [
                    {
                        messageCode: 'MFG50039',
                        messageKey: 'WORKORDER_MINQTY_ALREADY_IN_PUBLISH',
                        messageType: 'Information',
                        message: '{0} is minimum build quantity for work order, Production already started for this build quantity.',
                        category: 'MFG',
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: 'I'
                    }
                ]
            };
            break;
        case 997:
            msgobj = {
                messageBuildNumber: 998,
                developer: 'Ketan',
                message: [
                    {
                        messageCode: 'MFG50040',
                        messageKey: 'VALUE_NOT_CHANGE_AS_PRODUCTION_STARTED',
                        messageType: 'Information',
                        message: 'Work Order already started, you are not allowed to change "{0}".',
                        category: 'MFG',
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: 'I'
                    }
                ]
            };
            break;
        case 998:
            msgobj = {
                messageBuildNumber: 999,
                developer: 'Ketan',
                message: [
                    {
                        messageCode: 'MFG50041',
                        messageKey: 'WO_PRODUCTION_NOT_STARTED',
                        messageType: 'Information',
                        message: 'Production is not started yet.',
                        category: 'MFG',
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: 'I'
                    }
                ]
            };
            break;
        case 999:
            msgobj = {
                messageBuildNumber: 1000,
                developer: 'Ketan',
                message: [
                    {
                        messageCode: 'MFG50042',
                        messageKey: 'WO_PRODUCTION_STARTED_NOT_ALLOW_TO_CHANGE',
                        messageType: 'Information',
                        message: 'Production has started. You cannot change work order {0}.',
                        category: 'MFG',
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: 'I'
                    }
                ]
            };
            break;
        case 1000:
            msgobj = {
                messageBuildNumber: 1001,
                developer: 'Ketan',
                message: [
                    {
                        messageCode: 'MFG50043',
                        messageKey: 'VERIFY_WORKORDER_FIRST',
                        messageType: 'Information',
                        message: 'To publish work order, you must verify work order from operation section.',
                        category: 'MFG',
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: 'I'
                    }
                ]
            };
            break;
        case 1001:
            msgobj = {
                messageBuildNumber: 1002,
                developer: 'Ketan',
                message: [
                    {
                        messageCode: 'MFG50044',
                        messageKey: 'INVALID_WO_BUILD_QTY',
                        messageType: 'Information',
                        message: 'Invalid Work Order Build quantity.',
                        category: 'MFG',
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: 'I'
                    }
                ]
            };
            break;
        case 1002:
            msgobj = {
                messageBuildNumber: 1003,
                developer: 'Ketan',
                message: [
                    {
                        messageCode: 'MFG20042',
                        messageKey: 'HALT_RESUME_NOT_ALLOW_WORKORDER',
                        messageType: 'Error',
                        message: 'Action \"Halt/Resume Work Order\" is denied due to any of the following reasons. <br/><b>1. Work Order must be in \"Published\" mode.<br/>2. Logged-in user does not have rights to perform action.</b>',
                        category: 'MFG',
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: 'I'
                    }
                ]
            };
            break;
        case 1003:
            msgobj = {
                messageBuildNumber: 1004,
                developer: 'Champak',
                message: [
                    {
                        messageCode: 'MFG20039',
                        messageKey: 'NOT_PAID_INVOICE',
                        messageType: 'Error',
                        message: 'From selected record(s) some records(s) not approved to pay or already paid. Please check selected record(s).',
                        category: 'MFG',
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: 'U'
                    }
                ]
            };
            break;
        case 1004:
            msgobj = {
                messageBuildNumber: 1005,
                developer: "Dharmesh",
                message: [{
                    messageCode: 'RCV40055',
                    messageKey: 'RECEIVED_QTY_CONFIRMATION',
                    messageType: 'Confirmation',
                    message: 'Received qty will be overridden and you will lose qty detail. Press Yes to continue.',
                    category: 'RECEIVING',
                    createdDate: new Date(COMMON.getCurrentUTC()),
                    action: 'I'
                }]
            };
            break;

        case 1005:
            msgobj = {
                messageBuildNumber: 1006,
                developer: "Dharmesh",
                message: [{
                    messageCode: 'RCV20178',
                    messageKey: 'SO_CANCELED_NOT_ALLOW_TO_ALLOCATE_KIT',
                    messageType: 'Error',
                    message: 'This sales order is canceled so you cannot allocate any inventory in this kit.',
                    category: 'RECEIVING',
                    createdDate: new Date(COMMON.getCurrentUTC()),
                    action: 'I'
                }]
            };
            break;

        case 1006:
            msgobj = {
                messageBuildNumber: 1007,
                developer: "Dharmesh",
                message: [{
                    messageCode: 'RCV20179',
                    messageKey: 'SO_CANCELED_NOT_ALLOW_KIT_RELEASE',
                    messageType: 'Error',
                    message: 'This sales order is canceled so you cannot release the kit.',
                    category: 'RECEIVING',
                    createdDate: new Date(COMMON.getCurrentUTC()),
                    action: 'I'
                }]
            };
            break;
        case 1007:
            msgobj = {
                messageBuildNumber: 1008,
                developer: "Dharmesh",
                message: [{
                    messageCode: 'RCV20176',
                    messageKey: 'MFR_NOT_MAPPED_WITH_SUPPLIER',
                    messageType: 'ERROR',
                    message: 'This supplier is having strictly custom part setting, so we only allow the MFR which are already mapped to this supplier, and MFR {0} is not mapped to this supplier.',
                    category: 'RECEIVING',
                    modifiedDate: new Date(COMMON.getCurrentUTC()),
                    action: "U"

                }]
            };
            break;

        case 1008:
            msgobj = {
                messageBuildNumber: 1009,
                developer: "Dharmesh",
                message: [{
                    messageCode: 'RCV20177',
                    messageKey: 'MAPPED_MFRPN_IS_NOT_CUSTOM_PART',
                    messageType: 'ERROR',
                    message: 'This supplier is having strictly custom part setting, so we only allow MFR PN whose MFR is already mapped and the part is custom part, and the MFR PN {0} is not a custom part.',
                    category: 'RECEIVING',
                    modifiedDate: new Date(COMMON.getCurrentUTC()),
                    action: "U"
                }]
            };
            break;
        case 1009:
            msgobj = {
                messageBuildNumber: 1010,
                developer: "Champak",
                message: [{
                    messageCode: 'MFG20043',
                    messageKey: 'INVOICE_ALREADY_CREATED',
                    messageType: 'Error',
                    message: 'You can not change customer packing slip status as customer invoice created for packing slip# <b>{0}</b>.',
                    category: 'MFG',
                    createdDate: new Date(COMMON.getCurrentUTC()),
                    action: 'I'
                }]
            };
            break;
        case 1010:
            msgobj = {
                messageBuildNumber: 1011,
                developer: "Ketan",
                message: [{
                    messageCode: 'MFG50045',
                    messageKey: 'WO_OP_EMP_ACTIVITY_ALREADY_DONE',
                    messageType: 'Information',
                    message: 'Personnel activity already {0} for current operation.',
                    category: 'MFG',
                    createdDate: new Date(COMMON.getCurrentUTC()),
                    action: 'I'
                }]
            };
            break;
        case 1011:
            msgobj = {
                messageBuildNumber: 1012,
                developer: 'Champak',
                message: [
                    {
                        messageCode: 'MFG20039',
                        messageKey: 'NOT_PAID_INVOICE',
                        messageType: 'Error',
                        message: 'From selected record(s) some record(s) not approved to pay or already paid. Please check selected record(s).',
                        category: 'MFG',
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: 'U'
                    }
                ]
            };
            break;
        case 1012:
            msgobj = {
                messageBuildNumber: 1013,
                developer: 'Ketan',
                message: [
                    {
                        messageCode: 'MFG40017',
                        messageKey: 'WO_STATUS_CHANGE',
                        messageType: 'Confirmation',
                        message: 'Work order status will be changed from {0} to {1}, Press Yes to Continue.',
                        category: 'MFG',
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: 'I'
                    }
                ]
            };
            break;
        case 1013:
            msgobj = {
                messageBuildNumber: 1014,
                developer: 'Ketan',
                message: [
                    {
                        messageCode: 'MFG40018',
                        messageKey: 'WO_BUILD_QTY_CHANGE_REASON_CONFM',
                        messageType: 'Confirmation',
                        message: 'The Production is started. You have changed build qty, Press Yes to add reason.',
                        category: 'MFG',
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: 'I'
                    }
                ]
            };
            break;
        case 1014:
            msgobj = {
                messageBuildNumber: 1015,
                developer: 'Ketan',
                message: [
                    {
                        messageCode: 'MFG40019',
                        messageKey: 'WO_POQTY_MORE_THAN_BUILDQTY',
                        messageType: 'Confirmation',
                        message: 'PO quantity is more than build quantity! Move ahead?',
                        category: 'MFG',
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: 'I'
                    }
                ]
            };
            break;
        case 1015:
            msgobj = {
                messageBuildNumber: 1016,
                developer: 'Champak',
                message: [
                    {
                        messageCode: 'MFG20048',
                        messageKey: 'DUPLICATE_OTHER_EXPENSE',
                        messageType: 'Error',
                        message: 'Other Expense <b>{0}</b> is already exists for Assy <b>{1}</b>.',
                        category: 'MFG',
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: 'I'
                    }
                ]
            };
            break;
        case 1016:
            msgobj = {
                messageBuildNumber: 1017,
                developer: 'Shweta',
                message: [
                    {
                        messageCode: 'MFG20040',
                        messageKey: 'SELECT_ALEAST_ONE_PARTTYPE',
                        messageType: 'Error',
                        message: 'Select alteast one option from part filter.',
                        category: 'MFG',
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: 'I'
                    }
                ]
            };
            break;
        case 1017:
            msgobj = {
                messageBuildNumber: 1018,
                developer: 'Shweta',
                message: [
                    {
                        messageCode: 'MFG20041',
                        messageKey: 'SELECT_ALEAST_ONE_DOCTYPE',
                        messageType: 'Error',
                        message: 'Select alteast one option from document type.',
                        category: 'MFG',
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: 'I'
                    }
                ]
            };
            break;
        case 1018:
            msgobj = {
                messageBuildNumber: 1019,
                developer: 'Shweta',
                message: [
                    {
                        messageCode: 'MFG20045',
                        messageKey: 'TRANS_BUILD_QTY_FOR_REVISED_WO',
                        messageType: 'Error',
                        message: 'Before starting activity for revised workorder, Please transfer quantity from reference workorder.',
                        category: 'MFG',
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: 'I'
                    }
                ]
            };
            break;
        case 1019:
            msgobj = {
                messageBuildNumber: 1020,
                developer: 'Shweta',
                message: [
                    {
                        messageCode: 'MFG20049',
                        messageKey: 'WORKORDER_ALREADY_TRANSFERED',
                        messageType: 'Error',
                        message: 'WO# {0} already transfered.',
                        category: 'MFG',
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: 'I'
                    }
                ]
            };
            break;
        case 1020:
            msgobj = {
                messageBuildNumber: 1021,
                developer: 'Ketan',
                message: [
                    {
                        messageCode: 'MFG20051',
                        messageKey: 'WO_EXISTS_IN_PROD_FOR_SAVE_OPENING_PART_BAL',
                        messageType: 'Error',
                        message: 'WO# {0} already created for production. Please add different WO# for opening part balance.',
                        category: 'MFG',
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: 'I'
                    }
                ]
            };
            break;
        case 1021:
            msgobj = {
                messageBuildNumber: 1022,
                developer: "Shweta",
                message: [
                    {
                        messageCode: "MFG20037",
                        messageKey: "NO_DATA_FOUND_FOR_USAGE_DETAIL",
                        messageType: "Error",
                        message: "Report cannot be generated due to one of following reason: <br>1. Customer Packing Slip is neither created nor in publish mode.<br>2. No documents attached in Packing Slip or UMID for Material Usage report.",
                        category: "MFG",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "U"
                    }
                ]
            };
            break;
        case 1022:
            msgobj = {
                messageBuildNumber: 1023,
                developer: "Ashish",
                message: [
                    {
                        messageCode: "PRT20035",
                        messageKey: "PRODUCTION_PN_ALREADY_EXISTS",
                        messageType: "Error",
                        message: "Production PN already exists!",
                        category: "PARTS",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 1023:
            msgobj = {
                messageBuildNumber: 1024,
                developer: "Ketan",
                message: [
                    {
                        messageCode: "MFG20056",
                        messageKey: "WO_EXISTS_IN_OPENING_PART_BAL_FOR_SAVE_IN_PROD",
                        messageType: "Error",
                        message: "WO# {0} already created for opening part balance. Please add different WO# for production.",
                        category: "MFG",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 1024:
            msgobj = {
                messageBuildNumber: 1025,
                developer: "Shweta",
                message: [
                    {
                        messageCode: "MFG20053",
                        messageKey: "INVALID_WO_SO_PO_QTY",
                        messageType: "Error",
                        message: "Please enter valid Assigned PO Qty.",
                        category: "MFG",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 1025:
            msgobj = {
                messageBuildNumber: 1026,
                developer: "Shweta",
                message: [
                    {
                        messageCode: "MFG20054",
                        messageKey: "WO_SO_DTL_NOT_ALLOW_CHANGE",
                        messageType: "Error",
                        message: "Sales Order details cannot be changed as workorder status is either Published or Under Termination.",
                        category: "MFG",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 1026:
            msgobj = {
                messageBuildNumber: 1027,
                developer: "Champak",
                message: [
                    {
                        messageCode: "MFG20057",
                        messageKey: "INVALID_KITQUANTITY",
                        messageType: "Error",
                        message: "Assembly kit quantity tolerance alert! Following records have more/less than {0}% tolerance value,Press Yes to Continue?",
                        category: "MFG",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 1027:
            msgobj = {
                messageBuildNumber: 1028,
                developer: "Champak",
                message: [
                    {
                        messageCode: "MFG20058",
                        messageKey: "INVALID_SO_KIT_QTY",
                        messageType: "Error",
                        message: "Kit Qty should be less than or equal to MRP Qty.",
                        category: "MFG",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 1028:
            msgobj = {
                messageBuildNumber: 1029,
                developer: "Champak",
                message: [
                    {
                        messageCode: "GLOBAL",
                        messageKey: "SELECT_ONE_LABEL",
                        messageType: "Error",
                        message: "Please select at least one {0}.",
                        category: "GLOBAL",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 1029:
            msgobj = {
                messageBuildNumber: 1030,
                developer: "Shubham",
                message: [
                    {
                        messageCode: "MFG20044",
                        messageKey: "NOT_MORE_THAN_AVAILABLEQTY",
                        messageType: "Error",
                        message: "Total quantity should not be more than available quantity.",
                        category: "MFG",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 1030:
            msgobj = {
                messageBuildNumber: 1031,
                developer: "Shubham",
                message: [
                    {
                        messageCode: "MFG20046",
                        messageKey: "SCAN_VALID_BOX_SERIAL_NUMBER",
                        messageType: "Error",
                        message: "Please enter or scan valid Packaging/Box Serial#.",
                        category: "MFG",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 1031:
            msgobj = {
                messageBuildNumber: 1032,
                developer: "Shubham",
                message: [
                    {
                        messageCode: "MFG20047",
                        messageKey: "CANNOT_MOVE_SAME_BOX_SERIAL_NO",
                        messageType: "Error",
                        message: "From Packaging/Box Serial#  and To Packaging/Box Serial#  can not be same, please scan other Box.",
                        category: "MFG",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 1032:
            msgobj = {
                messageBuildNumber: 1033,
                developer: "Shubham",
                message: [
                    {
                        messageCode: "MFG20050",
                        messageKey: "DATECODE_REQUIRED",
                        messageType: "Error",
                        message: "Date Code is required to publish Work Order!",
                        category: "MFG",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 1033:
            msgobj = {
                messageBuildNumber: 1034,
                developer: "Shubham",
                message: [
                    {
                        messageCode: "MFG20052",
                        messageKey: "DATECODE_SAVE_BOX_SERIALNO_REQUIRED",
                        messageType: "Error",
                        message: "Date code is required in Work Order to save Packaging/Box Serial#.",
                        category: "MFG",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 1034:
            msgobj = {
                messageBuildNumber: 1035,
                developer: "Shubham",
                message: [
                    {
                        messageCode: "MFG10006",
                        messageKey: "BOX_SERIAL_NO_MOVED",
                        messageType: "Success",
                        message: "Product moved successfully.",
                        category: "MFG",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 1035:
            msgobj = {
                messageBuildNumber: 1036,
                developer: "Shubham",
                message: [
                    {
                        messageCode: "MFG10007",
                        messageKey: "SCAN_BOX_SERIAL",
                        messageType: "Success",
                        message: "Serial# scan successfully.",
                        category: "MFG",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 1036:
            msgobj = {
                messageBuildNumber: 1037,
                developer: "Ashish",
                message: [
                    {
                        messageCode: "PRT20036",
                        messageKey: "PRODUCTION_PN_LENGTH_VALIDATION",
                        messageType: "Error",
                        message: "Production PN length should not greater than {0}!",
                        category: "PARTS",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;

        case 1037:
            msgobj = {
                messageBuildNumber: 1038,
                developer: "Dharmesh",
                message: [{
                    messageCode: 'RCV20184',
                    messageKey: 'EXISTING_STOCK_ASSEMBLY_UMID',
                    messageType: 'Error',
                    message: 'You cannot create UMID for assembly <b>{0}</b> from Existing Stock.',
                    category: 'RECEIVING',
                    createdDate: new Date(COMMON.getCurrentUTC()),
                    action: 'I'
                }]
            };
            break;

        case 1038:
            msgobj = {
                messageBuildNumber: 1039,
                developer: "Dharmesh",
                message: [{
                    messageCode: 'RCV40057',
                    messageKey: 'PROPOSED_UMID_QTY_CONFIRMATION',
                    messageType: 'Confirmation',
                    message: 'Proposed UMID qty of this assembly <b>{0}</b> is <b>{1}</b>. Are you sure want create UMID with count <b>{2}</b>?',
                    category: 'RECEIVING',
                    createdDate: new Date(COMMON.getCurrentUTC()),
                    action: 'I'
                }]
            };
            break;

        case 1039:
            msgobj = {
                messageBuildNumber: 1040,
                developer: "Dharmesh",
                message: [{
                    messageCode: "MFG20016",
                    messageKey: "OPENING_STOCK_ENTRY_ALREADY_EXISTS",
                    messageType: "Error",
                    message: "Opening entry already exists for Assy ID <b>{0}</b> and WO# <b>{1}</b>.",
                    category: "MFG",
                    modifiedDate: new Date(COMMON.getCurrentUTC()),
                    action: "U"
                }]
            };
            break;

        case 1040:
            msgobj = {
                messageBuildNumber: 1041,
                developer: "Dharmesh",
                message: [{
                    messageCode: 'MFG20055',
                    messageKey: 'NOT_ALLOW_TO_REDUCE_OPENING_STOCK_QTY_THAN_UMID_QTY',
                    messageType: 'Error',
                    message: 'You cannot update opening stock quantity less than UMID created quantity i.e., <b>{0}</b>.',
                    category: 'MFG',
                    createdDate: new Date(COMMON.getCurrentUTC()),
                    action: 'I'
                }]
            };
            break;
        case 1041:
            msgobj = {
                messageBuildNumber: 1042,
                developer: "Shweta",
                message: [
                    {
                        messageCode: "MFG20035",
                        messageKey: "SCAN_MISSING_PART_KIT_NOT_RETURN",
                        messageType: "Error",
                        message: "You cannot scan missing material until kit is not returned for work order <b>{0}</b>.",
                        category: "MFG",
                        modifiedDate: new Date(COMMON.getCurrentUTC()),
                        action: "U"
                    }
                ]
            };
            break;
        case 1042:
            msgobj = {
                messageBuildNumber: 1043,
                developer: "Jignesh",
                message: [
                    {
                        messageCode: "MST20067",
                        messageKey: "INVALID_PARENT_ATTRIBUTE",
                        messageType: "Error",
                        message: "System will not allow to select {0} as Ref. Quote Attribute. Because it's already added at different level and it's creating loop #transaction. Please check and correct.",
                        category: "MASTER",
                        modifiedDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 1043:
            msgobj = {
                messageBuildNumber: 1044,
                developer: "Shubham",
                message: [
                    {
                        messageCode: "MFG40020",
                        messageKey: "SCAN_SERIAL_QTY_CONFIRMATION",
                        messageType: "Confirmation",
                        message: "Are you sure, From Serial# {0} to To Serial# {1} following no of assembly {2} will be add into box? Press Yes to Continue",
                        category: "MFG",
                        modifiedDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 1044:
            msgobj = {
                messageBuildNumber: 1045,
                developer: "Shubham",
                message: [
                    {
                        messageCode: "MFG20059",
                        messageKey: "SERIAL_NUMBER_MAPPING_REQUIRED",
                        messageType: "Error",
                        message: "Serial# Mapping is required with final serial# in prior to add in box",
                        category: "MFG",
                        modifiedDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;


        case 1045:
            msgobj = {
                messageBuildNumber: 1046,
                developer: "Dharmesh",
                message: [{
                    messageCode: 'MST50036',
                    messageKey: 'INVALID_RANGE_PREFIX_SUFFIX',
                    messageType: 'Information',
                    message: 'Invalid number, valid up to {0}!',
                    category: 'MASTER',
                    createdDate: new Date(COMMON.getCurrentUTC()),
                    action: 'I'
                }]
            };
            break;




        case 1046:
            msgobj = {
                messageBuildNumber: 1047,
                developer: "Dharmesh",
                message: [{
                    messageCode: 'RCV40058',
                    messageKey: 'PACKING_SLIP_LINE_EDIT_CONFIRMATION',
                    messageType: 'Confirmation',
                    message: 'Packing slip line# <b>{0}</b> already exists, do you want to edit that line detail?',
                    category: 'RECEIVING',
                    createdDate: new Date(COMMON.getCurrentUTC()),
                    action: 'I'
                }]
            };
            break;

        case 1047:
            msgobj = {
                messageBuildNumber: 1048,
                developer: "Dharmesh",
                message: [{
                    messageCode: 'RCV40059',
                    messageKey: 'PACKING_SLIP_LINE_EXIST_CONFIRMATION',
                    messageType: 'Confirmation',
                    message: 'Packing slip line# already exists in packing slip with <b>{0}</b>. Either you change packing slip line# by clicking <b>CHANGE LINE#</b> button or click on <b>EDIT LINE</b> to continue.',
                    category: 'RECEIVING',
                    createdDate: new Date(COMMON.getCurrentUTC()),
                    action: 'I'
                }]
            };
            break;


        case 1048:
            msgobj = {
                messageBuildNumber: 1049,
                developer: "Dharmesh",
                message: [{
                    messageCode: 'RCV40060',
                    messageKey: 'PACKING_SLIP_SCANNED_MISMATCH',
                    messageType: 'Confirmation',
                    message: '{0} of scanned label is mismatched with entered {0}. Press <b>RESET</b> to change {0}.',
                    category: 'RECEIVING',
                    createdDate: new Date(COMMON.getCurrentUTC()),
                    action: 'I'
                }]
            };
            break;
        case 1049:
            msgobj = {
                messageBuildNumber: 1050,
                developer: "Jignesh",
                message: [
                    {
                        messageCode: "RFQ20010",
                        messageKey: "LONG_REF_DES_IN_BOM",
                        messageType: "Error",
                        message: "BOM Item# {0} have total {1} REF DES / DNP REF DES, Which is more then configuration REF DES <b>{2}<b/>. <br/>Please verify REF DES / DNP REF DES for same or contact to Administrator.",
                        category: "RFQ",
                        modifiedDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 1050:
            msgobj = {
                messageBuildNumber: 1051,
                developer: "Shubham",
                message: [
                    {
                        messageCode: "MFG40020",
                        messageKey: "SCAN_SERIAL_QTY_CONFIRMATION",
                        messageType: "Confirmation",
                        message: "Are you sure, From Serial# <b>{0}</b> to To Serial# <b>{1}</b> following no of passed Qty <b>{2}</b> will be add into box? Press Yes to Continue",
                        category: "MFG",
                        modifiedDate: new Date(COMMON.getCurrentUTC()),
                        action: "U"
                    }
                ]
            };
            break;
        case 1051:
            msgobj = {
                messageBuildNumber: 1052,
                developer: "Shubham",
                message: [
                    {
                        messageCode: "MFG10006",
                        messageKey: "BOX_SERIAL_NO_MOVED",
                        messageType: "Success",
                        message: "Serial# moved successfully.",
                        category: "MFG",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "U"
                    }
                ]
            };
            break;
        case 1052:
            msgobj = {
                messageBuildNumber: 1053,
                developer: "Ashish",
                message: [
                    {
                        messageCode: "PRT40027",
                        messageKey: "COMPONENT_ADVANCE_FILTER_MULTIPLE_PART_UNCHECK_CONFIRMATION_MESSAGE",
                        messageType: "Confirmation",
                        message: 'Are you sure to clear search criteria whithin filter "{0}"? Press Yes to Continue.',
                        category: "PARTS",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 1053:
            msgobj = {
                messageBuildNumber: 1054,
                developer: "Shubham",
                message: [
                    {
                        messageCode: "MFG20060",
                        messageKey: "SCAN_BOX_SERIAL_NUMBER_TO_FOR_MOVE",
                        messageType: "Error",
                        message: '{0} Packaging/Box serial# is not scan yet, please scan {0} Packaging/Box serial# first.',
                        category: "MFG",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 1054:
            msgobj = {
                messageBuildNumber: 1055,
                developer: "Ashish",
                message: [
                    {
                        messageCode: "PRT50011",
                        messageKey: "COMPONENT_ADVANCE_FILTER_ATTRIBUTE_SEARCH_PLACEHOLDER",
                        messageType: "Information",
                        message: "Enter a {0} or attribute then press enter.",
                        category: "PARTS",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 1055:
            msgobj = {
                messageBuildNumber: 1056,
                developer: "Ashish",
                message: [
                    {
                        messageCode: "PRT50012",
                        messageKey: "COMPONENT_ADVANCE_FILTER_PARTNO_SEARCH_PLACEHOLDER",
                        messageType: "Information",
                        message: "ENTER A MFR PN THEN PRESS ENTER IT WILL SEARCH IN {0}.",
                        category: "PARTS",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 1056:
            msgobj = {
                messageBuildNumber: 1057,
                developer: "Ashish",
                message: [
                    {
                        messageCode: "PRT50013",
                        messageKey: "COMPONENT_ADVANCE_FILTER_PARTNO_HELPTEXT",
                        messageType: "Information",
                        message: "Enter {0} then press Enter to add search criteria and get search result.",
                        category: "PARTS",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 1057:
            msgobj = {
                messageBuildNumber: 1058,
                developer: "Ashish",
                message: [
                    {
                        messageCode: "PRT50011",
                        messageKey: "COMPONENT_ADVANCE_FILTER_ATTRIBUTE_SEARCH_PLACEHOLDER",
                        messageType: "Information",
                        message: "Enter a {0} or attribute then press enter",
                        category: "PARTS",
                        modifiedDate: new Date(COMMON.getCurrentUTC()),
                        action: "U"
                    }
                ]
            };
            break;
        case 1058:
            msgobj = {
                messageBuildNumber: 1059,
                developer: "Ashish",
                message: [
                    {
                        messageCode: "PRT50012",
                        messageKey: "COMPONENT_ADVANCE_FILTER_PARTNO_SEARCH_PLACEHOLDER",
                        messageType: "Information",
                        message: "ENTER A MFR PN THEN PRESS ENTER IT WILL SEARCH IN {0}",
                        category: "PARTS",
                        modifiedDate: new Date(COMMON.getCurrentUTC()),
                        action: "U"
                    }
                ]
            };
            break;
        case 1059:
            msgobj = {
                messageBuildNumber: 1060,
                developer: "Ashish",
                message: [
                    {
                        messageCode: "PRT50012",
                        messageKey: "COMPONENT_ADVANCE_FILTER_PARTNO_SEARCH_PLACEHOLDER",
                        messageType: "Information",
                        message: "ENTER A {1} THEN PRESS ENTER IT WILL SEARCH IN {0}",
                        category: "PARTS",
                        modifiedDate: new Date(COMMON.getCurrentUTC()),
                        action: "U"
                    }
                ]
            };
            break;
        case 1060:
            msgobj = {
                messageBuildNumber: 1061,
                developer: "Champak",
                message: [
                    {
                        messageCode: "GLB10018",
                        messageKey: "STOPPED",
                        messageType: "Success",
                        message: "{0} stopped successfully.",
                        category: "GLOBAL",
                        modifiedDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 1061:
            msgobj = {
                messageBuildNumber: 1062,
                developer: "Champak",
                message: [
                    {
                        messageCode: "PRT50014",
                        messageKey: "PART_UPDATE_STOPP",
                        messageType: "Information",
                        message: "Part update stopped by {0}.",
                        category: "PARTS",
                        modifiedDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 1062:
            msgobj = {
                messageBuildNumber: 1063,
                developer: "Champak",
                message: [
                    {
                        messageCode: "PRT50014",
                        messageKey: "PART_UPDATE_STOPP",
                        messageType: "Information",
                        message: "External part update stopped by {0}.",
                        category: "PARTS",
                        modifiedDate: new Date(COMMON.getCurrentUTC()),
                        action: "U"
                    }
                ]
            };
            break;
        case 1063:
            msgobj = {
                messageBuildNumber: 1064,
                developer: "Champak",
                message: [
                    {
                        messageCode: "PRT40028",
                        messageKey: "PART_STOP_CONFIRMATION",
                        messageType: "Confirmation",
                        message: "Are you sure to stop external part update? Press Yes to Continue.",
                        category: "PARTS",
                        modifiedDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 1064:
            msgobj = {
                messageBuildNumber: 1065,
                developer: "Ketan",
                message: [
                    {
                        messageCode: "MFG40021",
                        messageKey: "CHECKOUT_WITHOUT_SCAN_UMID_MATERIAL_CONFM",
                        messageType: "Confirmation",
                        message: "Are you sure you want to continue without scan materials? Press Yes to Continue.",
                        category: "MFG",
                        modifiedDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 1065:
            msgobj = {
                messageBuildNumber: 1066,
                developer: "Champak",
                message: [
                    {
                        messageCode: "PRT40028",
                        messageKey: "PART_STOP_CONFIRMATION",
                        messageType: "Confirmation",
                        message: "Are you sure to stop external part updating? Press Yes to Continue.",
                        category: "PARTS",
                        modifiedDate: new Date(COMMON.getCurrentUTC()),
                        action: "U"
                    }
                ]
            };
            break;
        case 1066:
            msgobj = {
                messageBuildNumber: 1067,
                developer: "Champak",
                message: [
                    {
                        messageCode: "PRT50014",
                        messageKey: "PART_UPDATE_STOPP",
                        messageType: "Information",
                        message: "External part updating has been stopped by <b>{0}</b>.",
                        category: "PARTS",
                        modifiedDate: new Date(COMMON.getCurrentUTC()),
                        action: "U"
                    }
                ]
            };
            break;
        case 1067:
            msgobj = {
                messageBuildNumber: 1068,
                developer: "Ketan",
                message: [
                    {
                        messageCode: "MFG50046",
                        messageKey: "TRAVELER_OPERATION_ACTIVITY_NOT_STARTED",
                        messageType: "Information",
                        message: "<b>{0}</b> operation activity is not started. Please start the operation activity first.",
                        category: "MFG",
                        modifiedDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 1068:
            msgobj = {
                messageBuildNumber: 1069,
                developer: "Shubhanm",
                message: [
                    {
                        messageCode: "MFG20064",
                        messageKey: "MFR_SERIAL_MUST_REQUIRED",
                        messageType: "Error",
                        message: "Must require MFR SR# for Serial# Mapping operation.",
                        category: "MFG",
                        modifiedDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 1069:
            msgobj = {
                messageBuildNumber: 1070,
                developer: "Shubham",
                message: [
                    {
                        messageCode: "MFG20063",
                        messageKey: "MIS_MATCH_WITH_MFR_FINAL_SR_NUMBER",
                        messageType: "Information",
                        message: "Work Order is not configured with Mapping Serial#. Either remove any one of MFR SR#/Final SR# or configure Mapping Serial# in Work Order Operation",
                        category: "MFG",
                        modifiedDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 1070:
            msgobj = {
                messageBuildNumber: 1071,
                developer: "Shweta",
                message: [
                    {
                        messageCode: "MFG20042",
                        messageKey: "HALT_RESUME_NOT_ALLOW_WORKORDER",
                        messageType: "Error",
                        message: "Action \"Halt/Resume Work Order\" is denied due to any of the following reasons. <br/><b>1. Work Order not in \"Published\" mode.<br/>2. Logged-in user does not have rights to perform action.</b>",
                        category: "MFG",
                        modifiedDate: new Date(COMMON.getCurrentUTC()),
                        action: "U"
                    }
                ]
            };
            break;
        case 1071:
            msgobj = {
                messageBuildNumber: 1072,
                developer: "Shweta",
                message: [
                    {
                        messageCode: "MFG20061",
                        messageKey: "CHANGE_WORKORDER_TYPE_CONFIRM",
                        messageType: "Error",
                        message: "All entered details will be lost, Are you sure want to continue?. Press Yes to Continue.",
                        category: "MFG",
                        modifiedDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 1072:
            msgobj = {
                messageBuildNumber: 1073,
                developer: "Shweta",
                message: [
                    {
                        messageCode: "MFG20062",
                        messageKey: "SAVE_DETAILS_FIRST",
                        messageType: "Error",
                        message: "To select sales order, save sales order details first.",
                        category: "MFG",
                        modifiedDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 1073:
            msgobj = {
                messageBuildNumber: 1074,
                developer: "Shweta",
                message: [
                    {
                        messageCode: "MFG20065",
                        messageKey: "WORKORDER_TERMINATED_NOT_ALLOW",
                        messageType: "Error",
                        message: "MFG quantity is required for an operation to terminate the work order.",
                        category: "MFG",
                        modifiedDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 1074:
            msgobj = {
                messageBuildNumber: 1075,
                developer: "Shweta",
                message: [
                    {
                        messageCode: "MFG20066",
                        messageKey: "WORKORDER_TERMINATED_OPERATION_NA",
                        messageType: "Error",
                        message: "Cannot terminate work order from rework or inspection type of operations.",
                        category: "MFG",
                        modifiedDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 1075:
            msgobj = {
                messageBuildNumber: 1076,
                developer: "Shweta",
                message: [
                    {
                        messageCode: "MFG20067",
                        messageKey: "WORKORDER_TERMINATED_NA",
                        messageType: "Error",
                        message: "Cannot terminate work order from this operation. Operation is in parallel type of cluster.",
                        category: "MFG",
                        modifiedDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 1076:
            msgobj = {
                messageBuildNumber: 1077,
                developer: "Shweta",
                message: [
                    {
                        messageCode: "MFG20068",
                        messageKey: "WORKORDER_ALREADY_TERMINATED",
                        messageType: "Error",
                        message: "This work order is already terminated at operation '{0}'.",
                        category: "MFG",
                        modifiedDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 1077:
            msgobj = {
                messageBuildNumber: 1078,
                developer: "Shweta",
                message: [
                    {
                        messageCode: "MFG20069",
                        messageKey: "OPERATION_CHECK_IN_MULTI",
                        messageType: "Error",
                        message: "Cannot transfer work order. Following operation(s) ongoing.<br/> {0}",
                        category: "MFG",
                        modifiedDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 1078:
            msgobj = {
                messageBuildNumber: 1079,
                developer: "Shweta",
                message: [
                    {
                        messageCode: "MFG10008",
                        messageKey: "WORKORDER_OPERATION_VERIFIED",
                        messageType: "Success",
                        message: "Work Order: Operations validated successfully.",
                        category: "MFG",
                        modifiedDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 1079:
            msgobj = {
                messageBuildNumber: 1080,
                developer: "Shweta",
                message: [
                    {
                        messageCode: "MFG20070",
                        messageKey: "WORKORDER_MUST_HAVE_ATLEAST_ONE_OPERATION",
                        messageType: "Error",
                        message: "Work Order must have at least one operation to publish.",
                        category: "MFG",
                        modifiedDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 1080:
            msgobj = {
                messageBuildNumber: 1081,
                developer: "Shweta",
                message: [
                    {
                        messageCode: "MFG20071",
                        messageKey: "NOT_AUTHORIZED_INVITED_EMP",
                        messageType: "Error",
                        message: "You are not authorized to invite new group members.",
                        category: "MFG",
                        modifiedDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 1081:
            msgobj = {
                messageBuildNumber: 1082,
                developer: "Shweta",
                message: [
                    {
                        messageCode: "MFG20072",
                        messageKey: "WORKORDER_CHANGEREQ_STATUS",
                        messageType: "Error",
                        message: "Please first acknowledge to all pending review comments.",
                        category: "MFG",
                        modifiedDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 1082:
            msgobj = {
                messageBuildNumber: 1083,
                developer: "Shweta",
                message: [
                    {
                        messageCode: "MFG10009",
                        messageKey: "WORKORDER_REQREVCOMMENTS_REQUEST_GENERATED",
                        messageType: "Success",
                        message: "Work Order: Review request comment saved successfully.",
                        category: "MFG",
                        modifiedDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 1083:
            msgobj = {
                messageBuildNumber: 1084,
                developer: "Shweta",
                message: [
                    {
                        messageCode: "MFG20073",
                        messageKey: "INVALID_ROHS_STATUS",
                        messageType: "Error",
                        message: "Assembly RoHS status set to TBD! Please check.",
                        category: "MFG",
                        modifiedDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 1084:
            msgobj = {
                messageBuildNumber: 1085,
                developer: "Shweta",
                message: [
                    {
                        messageCode: "MFG10010",
                        messageKey: "WORKORDER_REQREVCOMMENTS_REQUEST_ACCEPTED",
                        messageType: "Success",
                        message: "Work Order: Review request comment accepted successfully.",
                        category: "MFG",
                        modifiedDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 1085:
            msgobj = {
                messageBuildNumber: 1086,
                developer: "Shweta",
                message: [
                    {
                        messageCode: "MFG50047",
                        messageKey: "WORKORDER_REQREVCOMMENTS_REQUEST_REJECTED",
                        messageType: "Information",
                        message: "Work Order: Review request comment declined.",
                        category: "MFG",
                        modifiedDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 1086:
            msgobj = {
                messageBuildNumber: 1087,
                developer: "Ketan",
                message: [
                    {
                        messageCode: "MFG20074",
                        messageKey: "WO_DEFECT_DESIGANTOR_ALREADY_IN_USED_FOR_CURRENT",
                        messageType: "Error",
                        message: "Defect(s) log of \"{0}\" is already existed. To update it, first remove the current defect log(s).",
                        category: "MFG",
                        modifiedDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 1087:
            msgobj = {
                messageBuildNumber: 1088,
                developer: "Ketan",
                message: [
                    {
                        messageCode: "MFG20075",
                        messageKey: "WO_DEFECT_DESIGANTOR_ALREADY_IN_USED_FOR_TOTAL",
                        messageType: "Error",
                        message: "Defect(s) log of \"{0}\" is already existed. So you cannot update it.",
                        category: "MFG",
                        modifiedDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 1088:
            msgobj = {
                messageBuildNumber: 1089,
                developer: "Ketan",
                message: [
                    {
                        messageCode: "MFG20076",
                        messageKey: "WORKORDER_ASSY_DESIGNATORS_EXISTS",
                        messageType: "Error",
                        message: "Designator and pin combination already existed under this defect category.",
                        category: "MFG",
                        modifiedDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 1089:
            msgobj = {
                messageBuildNumber: 1090,
                developer: "Ketan",
                message: [
                    {
                        messageCode: "MFG20077",
                        messageKey: "CHECK_WO_DESIGNATOR_ADDED_DEFECT_INVALID",
                        messageType: "Error",
                        message: "You have entered invalid defect count. <br>Allowed to remove maximum defect count \"{0}\" <br>Entered defect count \"{1}\"",
                        category: "MFG",
                        modifiedDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 1090:
            msgobj = {
                messageBuildNumber: 1091,
                developer: "Ketan",
                message: [
                    {
                        messageCode: "MFG20078",
                        messageKey: "WO_DESIGNATOR_ALREADY_USED",
                        messageType: "Error",
                        message: "Defect(s) already added in designator. Please remove first.",
                        category: "MFG",
                        modifiedDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 1091:
            msgobj = {
                messageBuildNumber: 1092,
                developer: "Jignesh",
                message: [
                    {
                        messageCode: "RFQ50023",
                        messageKey: "BUY_AND_BUY_DNP_QTY_INVALID",
                        messageType: "Information",
                        message: "Buy and Buy DNP Qty for following line are mismatch. Please advice. <br/><strong> Invalid line item(s): {0}</strong>",
                        category: "RFQ",
                        modifiedDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 1092:
            msgobj = {
                messageBuildNumber: 1093,
                developer: "Champak",
                message: [
                    {
                        messageCode: "MFG10012",
                        messageKey: "SO_DATE_SHIP_VALIDATION",
                        messageType: "Confirmation",
                        message: " {0} less than Customer Consign Material Promised Dock Date, Are you sure want to continue? Press Yes to Continue.",
                        category: "MFG",
                        modifiedDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 1093:
            msgobj = {
                messageBuildNumber: 1094,
                developer: "Shweta",
                message: [
                    {
                        messageCode: "MFG40022",
                        messageKey: "FEEDER_STATUS_CHANGE",
                        messageType: "Confirmation",
                        message: "Do you want to apply {0}? Press Yes to Continue.",
                        category: "MFG",
                        modifiedDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 1094:
            msgobj = {
                messageBuildNumber: 1095,
                developer: "Shweta",
                message: [
                    {
                        messageCode: "GLB20049",
                        messageKey: "DYNAMIC_ERROR",
                        messageType: "Error",
                        message: "{0}",
                        category: "GLOBAL",
                        modifiedDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 1095:
            msgobj = {
                messageBuildNumber: 1096,
                developer: "Shweta",
                message: [
                    {
                        messageCode: "MFG40023",
                        messageKey: "FEEDER_STATUS_INACTIVE_ACTIVE",
                        messageType: "Confirmation",
                        message: "Do you want to change status from Inactive to Active? Press Yes to Continue.",
                        category: "MFG",
                        modifiedDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 1096:
            msgobj = {
                messageBuildNumber: 1097,
                developer: "Shweta",
                message: [
                    {
                        messageCode: "MFG10011",
                        messageKey: "FEEDER_ADDED_TO_WORKORDER_OPERATION_EQUIPMENT",
                        messageType: "Success",
                        message: "Work Order: Equipment Feeder detail(s) added to equipment operation.",
                        category: "MFG",
                        modifiedDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 1097:
            msgobj = {
                messageBuildNumber: 1098,
                developer: "Shweta",
                message: [
                    {
                        messageCode: "MFG40024",
                        messageKey: "IMPORT_WITH_EXISTING_CONFIRM",
                        messageType: "Confirmation",
                        message: "To import details with existing record. Press <b>Append & Import</b> button.<br/> To delete all existing and import details. Press <b>Delete all & Import</b>.",
                        category: "MFG",
                        modifiedDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 1098:
            msgobj = {
                messageBuildNumber: 1099,
                developer: "Champak",
                message: [
                    {
                        messageCode: "MFG40026",
                        messageKey: "SO_CCMPDD_DATE_VALIDATION",
                        messageType: "Confirmation",
                        message: " Customer Consign Material Promised Dock Date is greater than {0}, Are you sure want to continue? Press Yes to Continue.",
                        category: "MFG",
                        modifiedDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 1099:
            msgobj = {
                messageBuildNumber: 1100,
                developer: "Champak",
                message: [
                    {
                        messageCode: "MFG10012",
                        messageKey: "SO_DATE_SHIP_VALIDATION",
                        category: "MFG",
                        deletedDate: new Date(COMMON.getCurrentUTC()),
                        action: "D"
                    }
                ]
            };
            break;
        case 1100:
            msgobj = {
                messageBuildNumber: 1101,
                developer: "Champak",
                message: [
                    {
                        messageCode: "MFG40025",
                        messageKey: "SO_DATE_SHIP_VALIDATION",
                        messageType: "Confirmation",
                        message: " {0} less than Customer Consign Material Promised Dock Date, Are you sure want to continue? Press Yes to Continue.",
                        category: "MFG",
                        modifiedDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 1101:
            msgobj = {
                messageBuildNumber: 1102,
                developer: "Champak",
                message: [
                    {
                        messageCode: "MFG20079",
                        messageKey: "SO_WORKORDER_QTY_VALIDATION",
                        messageType: "Error",
                        message: "<b>{0}</b> PO Qty already assigned in the work order(s) <b>{1}</b>, To change <b>PO Qty</b>, Please update <b>Assigned PO Qty</b> in the work order.",
                        category: "MFG",
                        modifiedDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 1102:
            msgobj = {
                messageBuildNumber: 1103,
                developer: "Champak",
                message: [
                    {
                        messageCode: "MFG20080",
                        messageKey: "SO_PLANKIT_QTY_VALIDATION",
                        messageType: "Error",
                        message: "Kit already released for Assy ID <b>{0}</b> with qty {1}, To change <b>PO Qty</b>, please update <b>Planned Kit and Planned Build Qty</b> in Plan kit.",
                        category: "MFG",
                        modifiedDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 1103:
            msgobj = {
                messageBuildNumber: 1104,
                developer: "Champak",
                message: [
                    {
                        messageCode: "MFG40025",
                        messageKey: "SO_DATE_SHIP_VALIDATION",
                        messageType: "Confirmation",
                        message: "{0} less than Customer Consigned Material Promised Dock Date, Are you sure want to continue? Press Yes to Continue.",
                        category: "MFG",
                        modifiedDate: new Date(COMMON.getCurrentUTC()),
                        action: "U"
                    }
                ]
            };
            break;
        case 1104:
            msgobj = {
                messageBuildNumber: 1105,
                developer: "Champak",
                message: [
                    {
                        messageCode: "MFG40026",
                        messageKey: "SO_CCMPDD_DATE_VALIDATION",
                        messageType: "Confirmation",
                        message: " Customer Consigned Material Promised Dock Date is greater than {0}, Are you sure want to continue? Press Yes to Continue.",
                        category: "MFG",
                        modifiedDate: new Date(COMMON.getCurrentUTC()),
                        action: "U"
                    }
                ]
            };
            break;
        case 1105:
            msgobj = {
                messageBuildNumber: 1106,
                developer: "Champak",
                message: [{
                    messageCode: "MFG50003",
                    messageKey: "INVALID_SHIPPING",
                    messageType: "Information",
                    message: "Total Release count(s) of the Line ID {0} does not permit to add additional release line(s). <br/>Please either update Total Release in the Line ID {0} or add additional release line(s).",
                    category: "MFG",
                    createdDate: new Date(COMMON.getCurrentUTC()),
                    action: "U"
                }]
            };
            break;
        case 1106:
            msgobj = {
                messageBuildNumber: 1107,
                developer: "Champak",
                message: [{
                    messageCode: "MFG50048",
                    messageKey: "SO_ASSYID_SHIP_VALIDATION",
                    messageType: "Information",
                    message: "Assy ID <b>{0}</b> is not allow to change because, It is already shipped for customer packing slip(s) <b>{1}</b>.",
                    category: "MFG",
                    createdDate: new Date(COMMON.getCurrentUTC()),
                    action: "I"
                }]
            };
            break;
        case 1107:
            msgobj = {
                messageBuildNumber: 1108,
                developer: "Kinjal",
                message: [{
                    messageCode: "GLB20050",
                    messageKey: "HOME_MENU_CATEGORY_DUPLICATE_ENTRY",
                    messageType: "Error",
                    message: 'Following menu(s) not added, It already exists in \"{0}\" category.',
                    category: "GLOBAL",
                    modifiedDate: new Date(COMMON.getCurrentUTC()),
                    action: "I"
                }]
            };
            break;
        case 1108:
            msgobj = {
                messageBuildNumber: 1109,
                developer: "Ketan",
                message: [{
                    messageCode: "MFG40027",
                    messageKey: "WO_STATUS_WITH_VIEW_MODE_CONFM",
                    messageType: "Confirmation",
                    message: "Work order status will be changed from {0} to {1}.<br> After change status, work order will be in view mode. You will not make any changes in work order. Press Yes to Continue.",
                    category: "MFG",
                    createdDate: new Date(COMMON.getCurrentUTC()),
                    action: "I"
                }]
            };
            break;
        case 1109:
            msgobj = {
                messageBuildNumber: 1110,
                developer: "Champak",
                message: [{
                    messageCode: "MFG20082",
                    messageKey: "PACKING_SLIP_ALREADY_EXISTS",
                    messageType: "Error",
                    message: 'Packing Slip# <b>{0}</b> already exists, Please refresh packing slip#.',
                    category: "MFG",
                    modifiedDate: new Date(COMMON.getCurrentUTC()),
                    action: "I"
                }]
            };
            break;
        case 1110:
            msgobj = {
                messageBuildNumber: 1111,
                developer: "Shweta",
                message: [{
                    messageCode: "MFG20081",
                    messageKey: "WO_STATUS_SAVE_ALL_CHANGES",
                    messageType: "Error",
                    message: "Please save all changes before changing work order status.",
                    category: "MFG",
                    createdDate: new Date(COMMON.getCurrentUTC()),
                    action: "I"
                }]
            };
            break;
        case 1111:
            msgobj = {
                messageBuildNumber: 1112,
                developer: "Champak",
                message: [{
                    messageCode: "MFG40028",
                    messageKey: "SHIP_DETAIL_CONFIRMATION_ALERT",
                    messageType: "Confirmation",
                    message: "Shipping pending for previous line, Are you sure want to continue?",
                    category: "MFG",
                    createdDate: new Date(COMMON.getCurrentUTC()),
                    action: "I"
                }]
            };
            break;
        case 1112:
            msgobj = {
                messageBuildNumber: 1113,
                developer: "Champak",
                message: [{
                    messageCode: "MFG50049",
                    messageKey: "SO_DETAIL_REMOVE_VALIDATION",
                    messageType: "Information",
                    message: "Sales order assembly line ID details cannot be remove due to following reason:<br/><b>1.</b>Kit is released for selected line ID.<br/><b>2.</b>Work order is created for selected line ID.",
                    category: "MFG",
                    createdDate: new Date(COMMON.getCurrentUTC()),
                    action: "I"
                }]
            };
            break;
        case 1113:
            msgobj = {
                messageBuildNumber: 1114,
                developer: "Champak",
                message: [{
                    messageCode: "MFG40029",
                    messageKey: "CUSTOMER_SO_PACKING_SLIP_ADDRESS_SHIPPING_MISMATCH_CONFIRMATION",
                    messageType: "Confirmation",
                    message: "Selected packing slip shipping address or shipping method does not match with sales order ship to address or shipping method. Are you sure want to Continue? Press Yes to Continue.",
                    category: "MFG",
                    createdDate: new Date(COMMON.getCurrentUTC()),
                    action: "I"
                }]
            };
            break;
        case 1114:
            msgobj = {
                messageBuildNumber: 1115,
                developer: "Champak",
                message: [{
                    messageCode: "MFG50049",
                    messageKey: "SO_DETAIL_REMOVE_VALIDATION",
                    messageType: "Information",
                    message: "Sales order Assy ID <b>{0}</b> details cannot be remove for line ID <b>{1}</b> due to following reason:<br/><b> 1.</b>Kit already released.<br/><b> 2.</b>Work order already created.<br/><b> 3.</b>Customer Packing slip already generated.",
                    category: "MFG",
                    createdDate: new Date(COMMON.getCurrentUTC()),
                    action: "U"
                }]
            };
            break;
        case 1115:
            msgobj = {
                messageBuildNumber: 1116,
                developer: "Champak",
                message: [{
                    messageCode: "MFG50049",
                    messageKey: "SO_DETAIL_REMOVE_VALIDATION",
                    messageType: "Information",
                    message: "Sales order Assy ID <b>{0}</b> details cannot be remove for line ID <b>{1}</b> due to following reasons:<br/>&nbsp;<b> 1.</b>&nbsp;Kit already released.<br/>&nbsp;<b> 2.</b>&nbsp;Work order already created.<br/>&nbsp;<b> 3.</b>&nbsp;Customer Packing slip already generated.",
                    category: "MFG",
                    createdDate: new Date(COMMON.getCurrentUTC()),
                    action: "U"
                }]
            };
            break;
        case 1116:
            msgobj = {
                messageBuildNumber: 1117,
                developer: "Champak",
                message: [{
                    messageCode: "MFG50050",
                    messageKey: "SO_SHIPPING_DET_REMOVE_VALIDATION",
                    messageType: "Information",
                    message: "Release Line ID <b>{0}</b> cannot be remove because, It is already shipped for customer packing slip(s) <b>{1}</b>.",
                    category: "MFG",
                    createdDate: new Date(COMMON.getCurrentUTC()),
                    action: "I"
                }]
            };
            break;
        case 1117:
            msgobj = {
                messageBuildNumber: 1118,
                developer: "Charmi",
                message: [
                    {
                        messageCode: "GLB20033",
                        messageKey: "SSL_REQUIRED",
                        messageType: "Error",
                        message: "Invalid URL. Please enter an URL contains <b>https://</b>.",
                        category: "GLOBAL",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "U"
                    }
                ]
            };
            break;
        case 1118:
            msgobj = {
                messageBuildNumber: 1119,
                developer: "Champak",
                message: [
                    {
                        messageCode: "MFG50051",
                        messageKey: "CUSTOMER_PACKINGSLIP_PUBLISH_CONFIRMATION",
                        messageType: "Information",
                        message: "In prior to publish customer packing slip, you must have to fill up all required details of customer packing slip.",
                        category: "MFG",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 1119:
            msgobj = {
                messageBuildNumber: 1120,
                developer: "Ashish",
                message: [
                    {
                        messageCode: "PRT40027",
                        messageKey: "COMPONENT_ADVANCE_FILTER_MULTIPLE_PART_UNCHECK_CONFIRMATION_MESSAGE",
                        messageType: "Confirmation",
                        message: "Are you sure to clear search criteria within applied filter <b>{0}</b>? Press Yes to Continue.",
                        category: "PARTS",
                        modifiedDate: new Date(COMMON.getCurrentUTC()),
                        action: "U"
                    }
                ]
            };
            break;
        case 1120:
            msgobj = {
                messageBuildNumber: 1121,
                developer: "Fenil",
                message: [
                    {
                        messageCode: "RCV20193",
                        messageKey: "RECEIVED_STATUS_NOT_SET_AT_ADD_TIME",
                        messageType: "Error",
                        message: "You cannot change the <b>Received Status</b> to <b>Accepted</b> or <b>Rejected</b> as this part requires checking <b>Purchase Inspection Requirement(s)</b> by clicking on <b>Add</b> button. So please check that first then change the <b>Receiving Status</b>.",
                        category: "RECEIVING",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "U"
                    }
                ]
            };
            break;
        case 1121:
            msgobj = {
                messageBuildNumber: 1122,
                developer: "Fenil",
                message: [
                    {
                        messageCode: "RCV20194",
                        messageKey: "PS_LINE_NOT_DELETE_AS_MEMO_CREATED",
                        messageType: "Error",
                        message: "You cannot delete line(s) <b>{0}</b> as invoice level for these line(s) <b>Debit Memo</b> or <b>Credit Memo</b> are already created.",
                        category: "RECEIVING",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 1122:
            msgobj = {
                messageBuildNumber: 1123,
                developer: "Fenil",
                message: [
                    {
                        messageCode: "RCV40061",
                        messageKey: "CONFIRMATION_CHANGE_PS_MODE_FOR_DETAIL_DATA",
                        messageType: "Confirmation",
                        message: "Material details is not saved. If you press Yes then you will lose all unsaved work. Are you sure want to Continue? Press Yes for Continue.",
                        category: "RECEIVING",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 1123:
            msgobj = {
                messageBuildNumber: 1124,
                developer: "Champak",
                message: [{
                    messageCode: "MFG50049",
                    messageKey: "SO_DETAIL_REMOVE_VALIDATION",
                    messageType: "Information",
                    message: "Sales order Assy ID <b>{0}</b> details cannot be remove for line ID <b>{1}</b> due to following reasons:<br/>&nbsp;<b> 1.</b>&nbsp;Kit already released.<br/>&nbsp;<b> 2.</b>&nbsp;Work order already created.<br/>&nbsp;<b> 3.</b>&nbsp;Customer packing slip already generated.",
                    category: "MFG",
                    createdDate: new Date(COMMON.getCurrentUTC()),
                    action: "U"
                }]
            };
            break;
        case 1124:
            msgobj = {
                messageBuildNumber: 1125,
                developer: "Charmi",
                message: [
                    {
                        messageCode: "GLB20033",
                        messageKey: "SSL_REQUIRED",
                        messageType: "Error",
                        message: "Invalid URL. Please enter an URL with <b>'https://'</b>.",
                        category: "GLOBAL",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "U"
                    }
                ]
            };
            break;
        case 1125:
            msgobj = {
                messageBuildNumber: 1126,
                developer: "Champak",
                message: [{
                    messageCode: "RFQ50025",
                    messageKey: "ASSY_STATUS_CHECK_VERIFICATION",
                    messageType: "Information",
                    message: "RFQ Assy ID <b>{0}</b> already <b>{1}</b>. You cannot {2} it.",
                    category: "RFQ",
                    createdDate: new Date(COMMON.getCurrentUTC()),
                    action: "I"
                }]
            };
            break;
        case 1126:
            msgobj = {
                messageBuildNumber: 1127,
                developer: "Dharmesh",
                message: [{
                    messageCode: 'RCV20195',
                    messageKey: 'TRANSFER_MATERIAL_STOCK_TYPE_MISMATCH',
                    messageType: 'Error',
                    message: 'Scanned UMID does not belong to {0}. Please select the correct stock type.',
                    category: 'RECEIVING',
                    createdDate: new Date(COMMON.getCurrentUTC()),
                    action: 'I'
                }]
            };
            break;
        case 1127:
            msgobj = {
                messageBuildNumber: 1128,
                developer: "Champak",
                message: [{
                    messageCode: 'RCV20197',
                    messageKey: 'PURCHASE_ORDER_ALREADY_EXISTS',
                    messageType: 'Error',
                    message: 'PO# <b>{0}</b> already exists, Please refresh PO#.',
                    category: 'RECEIVING',
                    createdDate: new Date(COMMON.getCurrentUTC()),
                    action: 'I'
                }]
            };
            break;
        case 1128:
            msgobj = {
                messageBuildNumber: 1129,
                developer: "Champak",
                message: [{
                    messageCode: 'RCV20198',
                    messageKey: 'PO_ADDRESS_NOT_FOUND',
                    messageType: 'Error',
                    message: '{0} required. Please add it and process for save.',
                    category: 'RECEIVING',
                    createdDate: new Date(COMMON.getCurrentUTC()),
                    action: 'I'
                }]
            };
            break;
        case 1129:
            msgobj = {
                messageBuildNumber: 1130,
                developer: "Kinjal",
                message: [{
                    messageCode: "MFG50053",
                    messageKey: "ADJUSTMENT_STOCK_INVALID_QTY",
                    messageType: "Error",
                    message: "Adjustment Qty must be less or equal than Available Stock.",
                    category: "MFG",
                    createdDate: new Date(COMMON.getCurrentUTC()),
                    action: "I"
                }]
            };
            break;
        case 1130:
            msgobj = {
                messageBuildNumber: 1131,
                developer: "SHUBHAM",
                message: [{
                    messageCode: "PRT20037",
                    messageKey: "NOT_PROCESS_TO_CHANGE_PART_CLEANING_TYPE",
                    messageType: "Error",
                    message: "{0} cannot configured as {1}, For configure remove following work order operation(s) which is {2}.",
                    category: "PARTS",
                    createdDate: new Date(COMMON.getCurrentUTC()),
                    action: "I"
                }]
            };
            break;
        case 1131:
            msgobj = {
                messageBuildNumber: 1132,
                developer: "SHUBHAM",
                message: [{
                    messageCode: "PRT40029",
                    messageKey: "PROCEED_SAVE_CLEANING_TYPE",
                    messageType: "Confirmation",
                    message: "Following work order operation configure without {0}, Are you sre you want to continue? Press Yes for continue",
                    category: "PARTS",
                    createdDate: new Date(COMMON.getCurrentUTC()),
                    action: "I"
                }]
            };
            break;
        case 1132:
            msgobj = {
                messageBuildNumber: 1133,
                developer: "Shirish",
                message: [
                    {
                        messageCode: "RFQ50026",
                        messageKey: "SIMILAR_PRICE_GROUP_IMPORTED",
                        messageType: "Information",
                        message: "Following price group with similar assembly quantity detail is exists in imported data.",
                        category: "RFQ",
                        modifiedDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 1133:
            msgobj = {
                messageBuildNumber: 1134,
                developer: "Ashish",
                message: [
                    {
                        messageCode: "PRT40030",
                        messageKey: "DELETE_SALES_COMMISSION_FROM_LIST_CONFIRMATION",
                        messageType: "Confirmation",
                        message: "Sales Commission will be removed. Press Yes to Continue.",
                        category: "PARTS",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 1134:
            msgobj = {
                messageBuildNumber: 1135,
                developer: "Shweta",
                message: [{
                    messageCode: 'MFG20084',
                    messageKey: 'BEFORE_COMPLETE_PUBLISH_SO',
                    messageType: 'Error',
                    message: 'You can not complete Sales Order as it is in Draft status.',
                    category: 'MFG',
                    createdDate: new Date(COMMON.getCurrentUTC()),
                    action: 'I'
                }]
            };
            break;
        case 1135:
            msgobj = {
                messageBuildNumber: 1136,
                developer: "Dharmesh",
                message: [{
                    messageCode: 'MFG40030',
                    messageKey: 'REMOVE_KIT_ALLOCATION_UPDATE_CONFIRMATION',
                    messageType: 'Confirmation',
                    message: 'All allocated inventory of kit <b>{0}</b> will be deallocated once you save sales order transaction. Are you sure you want to remove kit?',
                    category: 'MFG',
                    createdDate: new Date(COMMON.getCurrentUTC()),
                    action: 'I'
                }]
            };
            break;
        case 1136:
            msgobj = {
                messageBuildNumber: 1137,
                developer: "Dharmesh",
                message: [{
                    messageCode: 'MFG20083',
                    messageKey: 'REMOVE_KIT_NOT_ALLOW_FOR_RELEASED_KIT',
                    messageType: 'Error',
                    message: 'You cannot remove kit <b>{0}</b> as kit released for this assembly.',
                    category: 'MFG',
                    createdDate: new Date(COMMON.getCurrentUTC()),
                    action: 'I'
                }]
            };
            break;
        case 1137:
            msgobj = {
                messageBuildNumber: 1138,
                developer: "Dharmesh",
                message: [{
                    messageCode: 'MFG50052',
                    messageKey: 'REMOVE_KIT_SAVE_INFORMATION',
                    messageType: 'Information',
                    message: 'Line ID <b>{0}</b> AssyID <b>{1}</b> Kit <b>{2}</b>.',
                    category: 'MFG',
                    createdDate: new Date(COMMON.getCurrentUTC()),
                    action: 'I'
                }]
            };
            break;
        case 1138:
            msgobj = {
                messageBuildNumber: 1139,
                developer: "Dharmesh",
                message: [{
                    messageCode: 'MFG40031',
                    messageKey: 'REMOVE_KIT_ALLOCATION_SAVE_CONFIRMATION',
                    messageType: 'Confirmation',
                    message: 'Following kit(s) allocated invenotry will be deallocated(if any), and kit will be removed. Are you sure you want to continue?<br/>',
                    category: 'MFG',
                    createdDate: new Date(COMMON.getCurrentUTC()),
                    action: 'I'
                }]
            };
            break;
        case 1139:
            msgobj = {
                messageBuildNumber: 1140,
                developer: "Dharmesh",
                message: [{
                    messageCode: 'MFG20084',
                    messageKey: 'REMOVE_KIT_NOT_ALLOW_FOR_RELEASED_KIT_SAVE',
                    messageType: 'Error',
                    message: 'For Following kit(s) you cannot check <b>DO NOT CREATE KIT</b> option as kit release is already done for these kit(s). Please remove checked the option to save sales order transaction.<br/>',
                    category: 'MFG',
                    createdDate: new Date(COMMON.getCurrentUTC()),
                    action: 'I'
                }]
            };
            break;
        case 1140:
            msgobj = {
                messageBuildNumber: 1141,
                developer: "Dharmesh",
                message: [{
                    messageCode: 'RCV20203',
                    messageKey: 'TRANSFER_MATERIAL_UMID_CUSTOMER_MISMATCH',
                    messageType: 'Error',
                    message: 'Scanned UMID does not belong to the selected customer. Please select the correct customer.',
                    category: 'RECEIVING',
                    createdDate: new Date(COMMON.getCurrentUTC()),
                    action: 'I'
                }]
            };
            break;
        case 1141:
            msgobj = {
                messageBuildNumber: 1142,
                developer: "Champak",
                message: [{
                    messageCode: 'RCV20204',
                    messageKey: 'PO_QTY_VALIDATION',
                    messageType: 'Error',
                    message: '{0} does not matched with {1}.',
                    category: 'RECEIVING',
                    createdDate: new Date(COMMON.getCurrentUTC()),
                    action: 'I'
                }]
            };
            break;
        case 1142:
            msgobj = {
                messageBuildNumber: 1143,
                developer: "Dharmesh",
                message: [{
                    messageCode: 'MFG20084',
                    messageKey: 'REMOVE_KIT_NOT_ALLOW_FOR_RELEASED_KIT_SAVE',
                    messageType: 'Error',
                    message: 'For Following kit(s) you cannot check <b>Do not Create Kit</b> option as kit release is already done for these kit(s). Please remove checked the option to save sales order transaction.<br/>',
                    category: 'MFG',
                    modifiedDate: new Date(COMMON.getCurrentUTC()),
                    action: 'U'
                }]
            };
            break;
        case 1143:
            msgobj = {
                messageBuildNumber: 1144,
                developer: 'Kinjal',
                message: [
                    {
                        messageCode: 'PRT40031',
                        messageKey: 'WO_COMPONENT_ROHS_CHANGE_MSG',
                        messageType: 'Confirmation',
                        message: 'Live RoHS change alert! Following record will be affected. Do you want to continue?',
                        category: 'PARTS',
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: 'I'
                    }
                ]
            };
            break;
        case 1144:
            msgobj = {
                messageBuildNumber: 1145,
                developer: 'Kinjal',
                message: [
                    {
                        messageCode: 'GLB40028',
                        messageKey: 'CHANGE_COMPANY_OWNERSHIP',
                        messageType: 'Confirmation',
                        message: 'Are you sure want to make {0} as company owner?',
                        category: 'GLOBAL',
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: 'I'
                    }
                ]
            };
            break;
        case 1145:
            msgobj = {
                messageBuildNumber: 1146,
                developer: "Fenil",
                message: [
                    {
                        messageCode: "RCV20007",
                        messageKey: "BOM_LINE_NOT_CLEAN",
                        messageType: "Error",
                        message: "Assembly <b>{0}'s</b> BOM line# <b>{1}</b> part(s) <b>{2}</b> are not clean or part are not Engineering Approved yet. Please clean line level issue to allocate material.",
                        category: "RECEIVING",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "U"
                    }
                ]
            };
            break;
        case 1146:
            msgobj = {
                messageBuildNumber: 1147,
                developer: "Fenil",
                message: [
                    {
                        messageCode: "RCV20199",
                        messageKey: "RMA_ADDRESS_NOT_FOUND",
                        messageType: "Error",
                        message: "<b>{0}</b> is required. Please add it and process for saving.",
                        category: "RECEIVING",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 1147:
            msgobj = {
                messageBuildNumber: 1148,
                developer: "Fenil",
                message: [
                    {
                        messageCode: "RCV20200",
                        messageKey: "UNIQUE_PS_FOR_RMA",
                        messageType: "Error",
                        message: "This {0}# <b>{1}</b> is already exists for supplier RMA <b>{2}</b>. Please enter unique {3}.",
                        category: "RECEIVING",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 1148:
            msgobj = {
                messageBuildNumber: 1149,
                developer: "Fenil",
                message: [
                    {
                        messageCode: "RCV20201",
                        messageKey: "RMA_NOT_CHANGE_AS_CREDIT_MEMO_CREATE",
                        messageType: "Error",
                        message: "You cannot change detail of RMA# <b>{0}</b> as credit memo is created against it.",
                        category: "RECEIVING",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 1149:
            msgobj = {
                messageBuildNumber: 1150,
                developer: "Fenil",
                message: [
                    {
                        messageCode: "RCV40062",
                        messageKey: "RMA_LINE_EDIT_CONFIRMATION",
                        messageType: "Confirmation",
                        message: "RMA line# <b>{0}</b> already exists, do you want to edit that line detail?",
                        category: "RECEIVING",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 1150:
            msgobj = {
                messageBuildNumber: 1151,
                developer: "Fenil",
                message: [
                    {
                        messageCode: "RCV20202",
                        messageKey: "RMA_LINE_NOT_CHANGE_AS_CREDIT_MEMO_CREATE",
                        messageType: "Error",
                        message: "You cannot change RMA material detail as credit memo is created against it.",
                        category: "RECEIVING",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 1151:
            msgobj = {
                messageBuildNumber: 1152,
                developer: "Fenil",
                message: [
                    {
                        messageCode: "RCV40063",
                        messageKey: "RMA_LINE_EXIST_CONFIRMATION",
                        messageType: "Confirmation",
                        message: "RMA line# already exists in RMA with part <b>{0}</b>. Either you change RMA line# by clicking <b>CHANGE LINE#</b> button or click on <b>EDIT LINE</b> to continue.",
                        category: "RECEIVING",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 1152:
            msgobj = {
                messageBuildNumber: 1153,
                developer: "Ashish",
                message: [
                    {
                        messageCode: "PRT20038",
                        messageKey: "COMPONENT_ASSY_SALES_PRICE_DUPLICATE",
                        messageType: "Error",
                        message: "Qty <b>{0}</b>, Turn Time <b>{1}</b> and Unit Of Time <b>{2}</b> already exists!",
                        category: "PARTS",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 1153:
            msgobj = {
                messageBuildNumber: 1154,
                developer: 'Kinjal',
                message: [
                    {
                        messageCode: 'GLB40028',
                        messageKey: 'CHANGE_COMPANY_OWNERSHIP',
                        messageType: 'Confirmation',
                        message: 'Are you sure want to make <b>{0} </b> as Company Owner?',
                        category: 'GLOBAL',
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: 'U'
                    }
                ]
            };
            break;
        case 1154:
            msgobj = {
                messageBuildNumber: 1155,
                developer: "Dharmesh",
                message: [{
                    messageCode: 'MFG40031',
                    messageKey: 'REMOVE_KIT_ALLOCATION_SAVE_CONFIRMATION',
                    messageType: 'Confirmation',
                    message: 'Following kit(s) allocated invenotry will be deallocated(if any), and kit will be removed. Are you sure you want to continue?',
                    category: 'MFG',
                    modifiedDate: new Date(COMMON.getCurrentUTC()),
                    action: 'U'
                }]
            };
            break;
        case 1155:
            msgobj = {
                messageBuildNumber: 1156,
                developer: "Dharmesh",
                message: [{
                    messageCode: 'MFG20084',
                    messageKey: 'REMOVE_KIT_NOT_ALLOW_FOR_RELEASED_KIT_SAVE',
                    messageType: 'Error',
                    message: 'For Following kit(s) you cannot check <b>DO NOT CREATE KIT</b> option as kit release is already done for these kit(s). Please remove checked the option to save sales order transaction.',
                    category: 'MFG',
                    modifiedDate: new Date(COMMON.getCurrentUTC()),
                    action: 'U'
                }]
            };
            break;
        case 1156:
            msgobj = {
                messageBuildNumber: 1157,
                developer: "Dharmesh",
                message: [{
                    messageCode: 'MST20068',
                    messageKey: 'RELEASE_DATE_BETWEEN_INVALID',
                    messageType: 'Error',
                    message: 'Released date must be between released date of version <b>{0}</b> and <b>{1}</b>.',
                    category: 'MASTER',
                    createdDate: new Date(COMMON.getCurrentUTC()),
                    action: "I"
                }]
            };
            break;
        case 1157:
            msgobj = {
                messageBuildNumber: 1158,
                developer: "Dharmesh",
                message: [{
                    messageCode: 'MST20070',
                    messageKey: 'RELEASE_DATE_LESS_THAN_INVALID',
                    messageType: 'Error',
                    message: 'Released date must be less then released date of version <b>{0}</b>.',
                    category: 'MASTER',
                    createdDate: new Date(COMMON.getCurrentUTC()),
                    action: "I"
                }]
            };
            break;

        case 1158:
            msgobj = {
                messageBuildNumber: 1159,
                developer: "Dharmesh",
                message: [{
                    messageCode: 'MFG50054',
                    messageKey: 'INVALID_RELEASELINE',
                    messageType: 'Error',
                    message: 'Release line not allowed for other charges, Please enter valid Line ID from sales order detail.',
                    category: 'MFG',
                    createdDate: new Date(COMMON.getCurrentUTC()),
                    action: "I"
                }]
            };
            break;
        case 1159:
            msgobj = {
                messageBuildNumber: 1160,
                developer: "Champak",
                message: [{
                    messageCode: 'RCV50037',
                    messageKey: 'PURCHASE_ORDER_PUBLISH_CONFIRMATION',
                    messageType: 'Information',
                    message: 'In prior to publish purchase order, you must have to fill up all required details of purchase order.',
                    category: 'RECEIVING',
                    createdDate: new Date(COMMON.getCurrentUTC()),
                    action: "I"
                }]
            };
            break;
        case 1160:
            msgobj = {
                messageBuildNumber: 1161,
                developer: "Champak",
                message: [{
                    messageCode: 'RCV40064',
                    messageKey: 'PO_STATUS_REVISION_CHANGE_CONFIRMATION',
                    messageType: 'Confirmation',
                    message: 'Purchase Order already published. Do you want to upgrade the PO Revision?',
                    category: 'RECEIVING',
                    createdDate: new Date(COMMON.getCurrentUTC()),
                    action: "I"
                }]
            };
            break;
        case 1161:
            msgobj = {
                messageBuildNumber: 1162,
                developer: "Dharmesh",
                message: [{
                    messageCode: 'MST20069',
                    messageKey: 'RELEASE_DATE_GREATER_THAN_INVALID',
                    messageType: 'Error',
                    message: 'Released date must be greater then released date of version <b>{0}</b>.',
                    category: 'MASTER',
                    createdDate: new Date(COMMON.getCurrentUTC()),
                    action: "I"
                }]
            };
            break;
        case 1162:
            msgobj = {
                messageBuildNumber: 1163,
                developer: 'Kinjal',
                message: [
                    {
                        messageCode: 'MFG40032',
                        messageKey: 'SERIAL_NO_DELETION_ERROR',
                        messageType: 'Confirmation',
                        message: 'Serial# cannot be deleted, You have selected invalid serial# from list.<br/>Only <b>last serial# </b> allowed to delete for selected <b>{0}</b>',
                        category: 'MFG',
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: 'I'
                    }
                ]
            };
            break;
        case 1163:
            msgobj = {
                messageBuildNumber: 1164,
                developer: 'Champak',
                message: [
                    {
                        messageCode: 'RCV40065',
                        messageKey: 'PO_DETAIL_WORK_CONFIRMATION',
                        messageType: 'Confirmation',
                        message: 'You will lose details unsaved work.<br/> Are you sure you want to Continue? Press Yes to Continue.',
                        category: 'RECEIVING',
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: 'I'
                    }
                ]
            };
            break;
        case 1164:
            msgobj = {
                messageBuildNumber: 1165,
                developer: 'Shubham',
                message: [
                    {
                        messageCode: 'GLB20053',
                        messageKey: 'SPECIAL_CHAR_NOT_ALLOWED',
                        messageType: 'ERROR',
                        message: '{0} Special Char not allowed.',
                        category: 'GLOBAL',
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: 'I'
                    }
                ]
            };
            break;
        case 1165:
            msgobj = {
                messageBuildNumber: 1166,
                developer: 'Shubham',
                message: [
                    {
                        messageCode: 'PRT20037',
                        messageKey: 'NOT_PROCESS_TO_CHANGE_PART_CLEANING_TYPE',
                        messageType: 'ERROR',
                        message: '{0} cannot configured as {1}, For configure remove following work order operation(s) which is {2}.',
                        category: 'PARTS',
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: 'U'
                    }
                ]
            };
            break;
        case 1166:
            msgobj = {
                messageBuildNumber: 1167,
                developer: 'Shubham',
                message: [
                    {
                        messageCode: 'PRT40029',
                        messageKey: 'PROCEED_SAVE_CLEANING_TYPE',
                        messageType: 'Confirmation',
                        message: 'Following {0} configure without {1}, Are you sre you want to continue? Press Yes for continue',
                        category: 'PARTS',
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: 'U'
                    }
                ]
            };
            break;
        case 1167:
            msgobj = {
                messageBuildNumber: 1168,
                developer: 'Kinjal',
                message: [
                    {
                        messageCode: 'MFG20085',
                        messageKey: 'SERIAL_NO_DELETION_ERROR',
                        messageType: 'Error',
                        message: 'Serial# cannot be deleted, You have selected invalid serial# from list.<br/>Only <b>last serial# </b> allowed to delete for selected <b>{0}</b>.',
                        category: 'MFG',
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: 'U'
                    }
                ]
            };
            break;
        case 1168:
            msgobj = {
                messageBuildNumber: 1169,
                developer: 'Kinjal',
                message: [{
                    messageCode: 'MFG40006',
                    messageKey: 'CONFIRM_BEFORE_RESET_SERIAL',
                    messageType: 'Confirmation',
                    message: 'All {0} will be removed. Are you sure? Press Yes to continue.',
                    category: 'MFG',
                    createdDate: new Date(COMMON.getCurrentUTC()),
                    action: 'U'
                }]
            };
            break;
        case 1169:
            msgobj = {
                messageBuildNumber: 1170,
                developer: 'Kinjal',
                message: [
                    {
                        messageCode: 'GLB40028',
                        messageKey: 'CHANGE_COMPANY_OWNERSHIP',
                        messageType: 'Confirmation',
                        message: 'Are you sure want to make <b>{0} </b> as Company Owner?',
                        category: 'GLOBAL',
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: 'U'
                    }
                ]
            };
            break;
        case 1170:
            msgobj = {
                messageBuildNumber: 1171,
                developer: 'Champak',
                message: [
                    {
                        messageCode: 'PRT40034',
                        messageKey: 'SEARCHED_PART_MISMATCH_WITH_MFRTYPE',
                        messageType: 'Information',
                        message: 'Searched part <b>{0}</b> is not a {1}. It is a {2}. The part is added to the system and can be searched from the {3}.',
                        category: 'PARTS',
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: 'I'
                    }
                ]
            };
            break;
        case 1171:
            msgobj = {
                messageBuildNumber: 1172,
                developer: 'Champak',
                message: [
                    {
                        messageCode: 'PRT40034',
                        messageKey: 'SEARCHED_PART_MISMATCH_WITH_MFRTYPE',
                        messageType: 'Information',
                        message: 'Searched part <b>{0}</b> is not a {1}. It is a {2}. <b>{0}</b>  is added to the system and can be searched from the {3}.',
                        category: 'PARTS',
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: 'U'
                    }
                ]
            };
            break;
        case 1172:
            msgobj = {
                messageBuildNumber: 1173,
                developer: "SHUBHAM",
                message: [{
                    messageCode: "PRT40029",
                    messageKey: "PROCEED_SAVE_CLEANING_TYPE",
                    messageType: "Confirmation",
                    message: "Following {0} configure {1} {2}, Are you sure you want to continue? Press Yes for continue",
                    category: "PARTS",
                    createdDate: new Date(COMMON.getCurrentUTC()),
                    action: "U"
                }]
            };
            break;
        case 1173:
            msgobj = {
                messageBuildNumber: 1174,
                developer: 'Champak',
                message: [
                    {
                        messageCode: 'RCV40066',
                        messageKey: 'MARKFOR_ADDRESS_REMOVE_CONFIRMATION',
                        messageType: 'Confirmation',
                        message: 'Are you sure want to remove mark for address? Press Yes to Continue.',
                        category: 'RECEIVING',
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: 'I'
                    }
                ]
            };
            break;
        case 1174:
            msgobj = {
                messageBuildNumber: 1175,
                developer: 'Champak',
                message: [
                    {
                        messageCode: 'RCV20211',
                        messageKey: 'PO_INVALID_LINE',
                        messageType: 'Error',
                        message: 'Total Release count(s) of the PO Line ID {0} does not permit to add additional release line(s). <br/>Please either update Total Release in the PO Line ID {0} or add additional release line(s).',
                        category: 'RECEIVING',
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: 'I'
                    }
                ]
            };
            break;
        case 1175:
            msgobj = {
                messageBuildNumber: 1176,
                developer: "Ashish",
                message: [
                    {
                        messageKey: "DELETE_SALES_COMMISSION_ALL_DATA_CONFIRMATION",
                        category: "PARTS",
                        messageType: "Confirmation",
                        messageCode: "PRT40033",
                        message: "Are you sure to delete Sales Commission details? Press Yes to Continue.",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 1176:
            msgobj = {
                messageBuildNumber: 1177,
                developer: "Shirish",
                message: [
                    {
                        messageCode: "RFQ50027",
                        messageKey: "SIMILAR_ASSY_IN_PRICE_GROUP_IMPORTED",
                        messageType: "Information",
                        message: "Duplicate assembly are not allowed in one price group.<br/>Following price group contains duplicate assembly.",
                        category: "RFQ",
                        modifiedDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 1177:
            msgobj = {
                messageBuildNumber: 1178,
                developer: "Ketan",
                message: [
                    {
                        messageCode: "GLB40029",
                        messageKey: "DEFINE_ADDRESS_REMOVE_CONFIRMATION",
                        messageType: "Confirmation",
                        message: "Are you sure want to remove {0} address? Press Yes to Continue.",
                        category: "GLOBAL",
                        modifiedDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 1178:
            msgobj = {
                messageBuildNumber: 1179,
                developer: "Champak",
                message: [
                    {
                        messageCode: "MFG50055",
                        messageKey: "SALES_ORDER_REPORT_GENERATE",
                        messageType: "Information",
                        message: "In prior to generate sales order Report, you must have to fill up all required details of sales order.",
                        category: "MFG",
                        modifiedDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 1179:
            msgobj = {
                messageBuildNumber: 1180,
                developer: "Purav",
                message: [{
                    messageCode: 'PRT40032',
                    messageKey: 'CAPTURE_IMAGES_ONLINE_CAMERA_CONFIRMATION',
                    messageType: 'Confirmation',
                    message: '<b>{0}</b> camera out of <b>{1}</b> is <b>OFFLINE</b>. Are you sure you want to capture images using <b>{2}</b> camera?',
                    category: 'PARTS',
                    createdDate: new Date(COMMON.getCurrentUTC()),
                    action: "I"
                }]
            };
            break;
        case 1180:
            msgobj = {
                messageBuildNumber: 1181,
                developer: "Purav",
                message: [{
                    messageCode: 'PRT50015',
                    messageKey: 'NO_ONLINE_CAMERA_AVAILABLE',
                    messageType: 'Information',
                    message: 'All camera(s) are offline. Please check configuration',
                    category: 'PARTS',
                    createdDate: new Date(COMMON.getCurrentUTC()),
                    action: "I"
                }]
            };
            break;
        case 1181:
            msgobj = {
                messageBuildNumber: 1182,
                developer: 'Kinjal',
                message: [
                    {
                        messageCode: 'GLB40028',
                        messageKey: 'CHANGE_COMPANY_OWNERSHIP',
                        messageType: 'Confirmation',
                        message: 'Are you sure want to make <b>{0}</b> as company owner?',
                        category: 'GLOBAL',
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: 'U'
                    }
                ]
            };
            break;
        case 1182:
            msgobj = {
                messageBuildNumber: 1183,
                developer: 'Shubham',
                message: [
                    {
                        messageCode: 'PRT20037',
                        messageKey: 'NOT_PROCESS_TO_CHANGE_PART_CLEANING_TYPE',
                        messageType: 'ERROR',
                        message: '{0} cannot configured as {1}, For configure remove {2} following work order operation(s) which is {3}.',
                        category: 'PARTS',
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: 'U'
                    }
                ]
            };
            break;
        case 1183:
            msgobj = {
                messageBuildNumber: 1184,
                developer: "Ketan",
                message: [
                    {
                        messageCode: "MFG50051",
                        messageKey: "CUSTOMER_PACKINGSLIP_PUBLISH_CONFIRMATION",
                        messageType: "Information",
                        message: "In prior to {0} customer packing slip, you must have to fill up all required details of customer packing slip.",
                        category: "MFG",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "U"
                    }
                ]
            };
            break;
        case 1184:
            msgobj = {
                messageBuildNumber: 1185,
                developer: "Ashish",
                message: [
                    {
                        messageKey: "NO_NEED_TO_PAY_FOR_CREDIT_OR_ZERO_DUE",
                        category: "RECEIVING",
                        messageType: "Information",
                        messageCode: "RCV50038",
                        message: "You already have credit amount or zero outstanding amount, so no need to make payment.",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 1185:
            msgobj = {
                messageBuildNumber: 1186,
                developer: "Ashish",
                message: [
                    {
                        messageKey: "NO_NEED_TO_PAY_FOR_CREDIT_OR_ZERO_DUE",
                        category: "RECEIVING",
                        messageType: "Information",
                        messageCode: "RCV50038",
                        message: "You already have credit amount, so no need to make payment.",
                        modifiedDate: new Date(COMMON.getCurrentUTC()),
                        action: "U"
                    }
                ]
            };
            break;
        case 1186:
            msgobj = {
                messageBuildNumber: 1187,
                developer: "Ketan",
                message: [
                    {
                        messageKey: "DEFINE_FIELD_REQUIRED_FOR_FURTHER_PROCESSING",
                        category: "GLOBAL",
                        messageType: "ERROR",
                        messageCode: "GLB20054",
                        message: "{0} is required for further processing.",
                        modifiedDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 1187:
            msgobj = {
                messageBuildNumber: 1188,
                developer: "Shweta",
                message: [
                    {
                        messageCode: "MFG20086",
                        messageKey: "INVOICE_LOCKED_FOR_PAYMENT",
                        messageType: "Information",
                        message: "Selected invoice locked for payment. You can not delete customer invoice.<br/> {0}",
                        category: "MFG",
                        modifiedDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 1188:
            msgobj = {
                messageBuildNumber: 1189,
                developer: "Ashish",
                message: [
                    {
                        messageKey: "DATASHEET_LINK_ALREADY_EXISTS",
                        category: "PARTS",
                        messageType: "Error",
                        messageCode: "PRT20039",
                        message: "Data sheet link already exists!",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 1189:
            msgobj = {
                messageBuildNumber: 1190,
                developer: "Ashish",
                message: [
                    {
                        messageKey: "DATASHEET_FILE_ALREADY_EXISTS",
                        category: "PARTS",
                        messageType: "Error",
                        messageCode: "PRT20040",
                        message: "Data sheet file with same name already exists!",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 1190:
            msgobj = {
                messageBuildNumber: 1191,
                developer: 'Kinjal',
                message: [{
                    messageCode: 'MFG20017',
                    messageKey: 'OPENING_STOCK_MUST_BE_GREATER_THAN_ZERO',
                    messageType: "Error",
                    message: 'Opening stock must be greater than zero.',
                    category: 'MFG',
                    createdDate: new Date(COMMON.getCurrentUTC()),
                    action: 'U'
                }]
            };
            break;
        case 1191:
            msgobj = {
                messageBuildNumber: 1192,
                developer: 'Kinjal',
                message: [{
                    messageCode: 'MFG20087',
                    messageKey: 'NOT_ALLOW_TO_REDUCE_OPENING_STOCK_QTY_THAN_UMID_SHIPPED_QTY',
                    messageType: 'Error',
                    message: 'You cannot update opening stock quantity less than shipped and UMID created quantity i.e., {0}.',
                    category: 'MFG',
                    createdDate: new Date(COMMON.getCurrentUTC()),
                    action: 'I'
                }]
            };
            break;
        case 1192:
            msgobj = {
                messageBuildNumber: 1193,
                developer: "Ashish",
                message: [
                    {
                        messageKey: "COMPONENT_ADVANCE_FILTER_PARTNO_HELPTEXT",
                        category: "PARTS",
                        messageType: "Information",
                        messageCode: "PRT50013",
                        message: "Enter {0} then press Enter to add search criteria and get search result. (Alias of Mounting Type and Functional Types are also covered under search criteria)",
                        modifiedDate: new Date(COMMON.getCurrentUTC()),
                        action: "U"
                    }
                ]
            };
            break;
        case 1193:
            msgobj = {
                messageBuildNumber: 1194,
                developer: "Fenil",
                message: [
                    {
                        messageCode: "RCV30009",
                        messageKey: "PACKING_SLIP_UNIQUE",
                        messageType: "Error",
                        category: "RECEIVING",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "D"
                    }
                ]
            };
            break;
        case 1194:
            msgobj = {
                messageBuildNumber: 1195,
                developer: "Fenil",
                message: [
                    {
                        messageCode: "RCV20205",
                        messageKey: "PACKING_SLIP_UNIQUE",
                        messageType: "Error",
                        message: "This {0} <b>{1}</b> is already exists for supplier <b>{2}</b>. Please enter unique {3}.",
                        category: "RECEIVING",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 1195:
            msgobj = {
                messageBuildNumber: 1196,
                developer: "Fenil",
                message: [
                    {
                        messageCode: "RCV20206",
                        messageKey: "RMA_NOT_FOUND",
                        messageType: "Error",
                        message: "RMA# <b>{0}</b> not found.",
                        category: "RECEIVING",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 1196:
            msgobj = {
                messageBuildNumber: 1197,
                developer: "Fenil",
                message: [
                    {
                        messageCode: "RCV20207",
                        messageKey: "SUPPLIER_RMA_ALREADY_CREATED",
                        messageType: "Error",
                        message: "RMA# <b>{0}'s</b> supplier RMA is already created for supplier <b>{1}</b>.",
                        category: "RECEIVING",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 1197:
            msgobj = {
                messageBuildNumber: 1198,
                developer: "Fenil",
                message: [
                    {
                        messageCode: "RCV20208",
                        messageKey: "RMA_NOT_DETAIL_LINE",
                        messageType: "Error",
                        message: "RMA# <b>{0}</b> don't have single line of RMA material details. So you cannot get any detail of supplier RMA.",
                        category: "RECEIVING",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 1198:
            msgobj = {
                messageBuildNumber: 1199,
                developer: "Fenil",
                message: [
                    {
                        messageCode: "RCV20209",
                        messageKey: "RMA_NOT_IN_SHIPPED_CREDIT_MEMO_NOT_CREATE",
                        messageType: "Error",
                        message: "You cannot create RMA credit memo as supplier RMA <b>{0}</b> is not in <b>Shipped</b> mode.",
                        category: "RECEIVING",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 1199:
            msgobj = {
                messageBuildNumber: 1200,
                developer: "Fenil",
                message: [
                    {
                        messageCode: "RCV20048",
                        messageKey: "UPDATE_INVOICE_PRICE",
                        messageType: "Error",
                        message: "<b>{0}</b> must be greater than 0.",
                        category: "RECEIVING",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "U"
                    }
                ]
            };
            break;
        case 1200:
            msgobj = {
                messageBuildNumber: 1201,
                developer: "Fenil",
                message: [
                    {
                        messageCode: "RCV20212",
                        messageKey: "ADD_INVOICE_FOR_ADD_RMA",
                        messageType: "Error",
                        message: "You cannot add material detail as you have to add <b>Ref.Supplier Invoice</b> of Ref. Packing slip# <b>{0}</b>.",
                        category: "RECEIVING",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 1201:
            msgobj = {
                messageBuildNumber: 1202,
                developer: "Fenil",
                message: [
                    {
                        messageCode: "RCV20213",
                        messageKey: "PART_NOT_CONTAIN_IN_PAKING_SLIP",
                        messageType: "Error",
                        message: "Part <b>{0}</b> is not contain in packing slip <b>{1}</b> with packaging <b>{2}</b>.",
                        category: "RECEIVING",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 1202:
            msgobj = {
                messageBuildNumber: 1203,
                developer: "Fenil",
                message: [
                    {
                        messageCode: "RCV20214",
                        messageKey: "PART_NOT_CONTAIN_IN_INVOICE",
                        messageType: "Error",
                        message: "Part <b>{0}</b> is not contain in supplier invoice <b>{1}</b> with packaging <b>{2}</b>.",
                        category: "RECEIVING",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 1203:
            msgobj = {
                messageBuildNumber: 1204,
                developer: "Fenil",
                message: [
                    {
                        messageCode: "RCV50039",
                        messageKey: "RE_GET_CREDIT_MEMO_LINE",
                        messageType: "Information",
                        message: "In supplier RMA# <b>{0}</b> have added <b>{1}</b> new line(s), updated <b>{2}</b> line(s) and removed <b>{3}</b> line(s). <br /> So, Please press <b>REGET CREDIT MEMO DETAIL</b> button to get updated credit memo details.",
                        category: "RECEIVING",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 1204:
            msgobj = {
                messageBuildNumber: 1205,
                developer: "Shweta",
                message: [
                    {
                        messageKey: "PART_FLUX_TYPE_NOT_CONFIGURED",
                        category: "MFG",
                        messageType: "Error",
                        messageCode: "MFG20088",
                        message: "Flux type not configured at part master level. <br/>{0}",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 1205:
            msgobj = {
                messageBuildNumber: 1206,
                developer: 'Vaibhav',
                message: [
                    {
                        messageCode: 'MFG20089',
                        messageKey: 'MUST_BE_SAME_CUSTOMER',
                        messageType: 'Error',
                        message: 'Customer must be same for selected record(s). Please check selected record(s).',
                        category: 'MFG',
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: 'I'
                    }
                ]
            };
            break;
        case 1206:
            msgobj = {
                messageBuildNumber: 1207,
                developer: "Champak",
                message: [
                    {
                        messageCode: "MFG50055",
                        messageKey: "SALES_ORDER_REPORT_GENERATE",
                        messageType: "Information",
                        message: "In prior to generate sales order report, You must have to fill up all required details of sales order.",
                        category: "MFG",
                        modifiedDate: new Date(COMMON.getCurrentUTC()),
                        action: "U"
                    }
                ]
            };
            break;
        case 1207:
            msgobj = {
                messageBuildNumber: 1208,
                developer: "Ketan",
                message: [{
                    messageCode: "MFG40029",
                    messageKey: "CUSTOMER_SO_PACKING_SLIP_ADDRESS_SHIPPING_MISMATCH_CONFIRMATION",
                    messageType: "Confirmation",
                    message: "Packing Slip header shipping address/shipping method is mismatched with release line shipping address/shipping method. If you want to set release line shipping address/shipping method as packing slip header, Press Yes to continue.",
                    category: "MFG",
                    createdDate: new Date(COMMON.getCurrentUTC()),
                    action: "U"
                }]
            };
            break;
        case 1208:
            msgobj = {
                messageBuildNumber: 1209,
                developer: "Ketan",
                message: [{
                    messageCode: "MFG20093",
                    messageKey: "CREATE_NEW_PACKING_SLIP_ON_SHIP_ADDR_MISMATCH",
                    messageType: "Error",
                    message: "Selected release line shipping address/shipping method is mismatched with packing slip shipping address/shipping method, Please create new packing slip.",
                    category: "MFG",
                    createdDate: new Date(COMMON.getCurrentUTC()),
                    action: "I"
                }]
            };
            break;
        case 1209:
            msgobj = {
                messageBuildNumber: 1210,
                developer: "Ashish",
                message: [
                    {
                        messageKey: "INVOICE_PAYMENT_MAX_RECORDS_VALIDATION_MESSAGE",
                        category: "RECEIVING",
                        messageType: "Error",
                        messageCode: "RCV20215",
                        message: "Maximum {0} records are allowed to pay at a time, you have selected {1} records.",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 1210:
            msgobj = {
                messageBuildNumber: 1211,
                developer: "Ashish",
                message: [
                    {
                        messageKey: "COMPONENT_ADVANCE_FILTER_PARTNO_HELPTEXT",
                        category: "PARTS",
                        messageType: "Information",
                        messageCode: "PRT50013",
                        message: "Enter the {0} or Part Attributes and press Enter to add search criteria and get the search results. (Alias of Mounting Type and Functional Types are also covered under search criteria)",
                        modifiedDate: new Date(COMMON.getCurrentUTC()),
                        action: "U"
                    }
                ]
            };
            break;
        case 1211:
            msgobj = {
                messageBuildNumber: 1212,
                developer: "Shubham",
                message: [
                    {
                        messageKey: "UPLOAD_CSV_EXCEL_WITH_ERROR_RECORD",
                        category: "MFG",
                        messageType: "Error",
                        messageCode: "MFG20094",
                        message: "File successfully imported, partially. But some of the {0} record(s) contain errors. Please check error file for detail.<br>Total Records: <b>{1}</b>, Successfully Imported Records: <b>{2}</b>, Failure Records: <b>{3}</b>",
                        modifiedDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 1212:
            msgobj = {
                messageBuildNumber: 1213,
                developer: "Ashish",
                message: [
                    {
                        messageKey: "PRICE_BREAK_UPDATE_CONFIRMATION",
                        category: "PARTS",
                        messageType: "Confirmation",
                        messageCode: "PRT40019",
                        message: "Selected Sales Price Break: <b>{0}</b> and Unit Price: <b>{1}</b> will be updated. Press Yes to Continue.",
                        modifiedDate: new Date(COMMON.getCurrentUTC()),
                        action: "U"
                    }
                ]
            };
            break;
        case 1213:
            msgobj = {
                messageBuildNumber: 1214,
                developer: "Ashish",
                message: [
                    {
                        messageKey: "UNIQUE_PRICE_BREAK",
                        category: "PARTS",
                        messageType: "Error",
                        messageCode: "PRT20021",
                        message: "Sales price break should be different.",
                        modifiedDate: new Date(COMMON.getCurrentUTC()),
                        action: "U"
                    }
                ]
            };
            break;
        case 1214:
            msgobj = {
                messageBuildNumber: 1215,
                developer: "Ashish",
                message: [
                    {
                        messageKey: "PRICE_BREAK_VALIDATION_MESSAGE",
                        category: "PARTS",
                        messageType: "Error",
                        messageCode: "PRT20023",
                        message: "Unit price for <b>{0}</b> Sales price break must be less or equal to all lower sales price break.",
                        modifiedDate: new Date(COMMON.getCurrentUTC()),
                        action: "U"
                    }
                ]
            };
            break;
        case 1215:
            msgobj = {
                messageBuildNumber: 1216,
                developer: 'Kinjal',
                message: [{
                    messageCode: 'MFG20087',
                    messageKey: 'NOT_ALLOW_TO_REDUCE_OPENING_STOCK_QTY_THAN_UMID_SHIPPED_QTY',
                    messageType: 'Error',
                    message: 'Opening Stock Qty cannot less than Shipped Qty and UMID Stock. i.e., {0}.',
                    category: 'MFG',
                    createdDate: new Date(COMMON.getCurrentUTC()),
                    action: 'U'
                }]
            };
            break;
        case 1216:
            msgobj = {
                messageBuildNumber: 1217,
                developer: 'Kinjal',
                message: [{
                    messageCode: 'MFG20091',
                    messageKey: 'WO_SERIES_ALREADY_EXISTS',
                    messageType: 'Error',
                    message: 'WO Series <b>{0}</b> already exists. Please add different WO Series for opening part balance.',
                    category: 'MFG',
                    createdDate: new Date(COMMON.getCurrentUTC()),
                    action: 'I'
                }]
            };
            break;

        case 1217:
            msgobj = {
                messageBuildNumber: 1218,
                developer: 'Kinjal',
                message: [{
                    messageCode: 'MFG20092',
                    messageKey: 'INVALID_WO_SERIES',
                    messageType: 'Error',
                    message: 'Invalid WO# Series. Please enter WO# with <b>{0}</b> series.',
                    category: 'MFG',
                    createdDate: new Date(COMMON.getCurrentUTC()),
                    action: 'I'
                }]
            };
            break;
        case 1218:
            msgobj = {
                messageBuildNumber: 1219,
                developer: "Shweta",
                message: [
                    {
                        messageKey: "PID_PRODUCTIONPN_REQUIRED",
                        category: "MFG",
                        messageType: "Error",
                        messageCode: "MFG20094",
                        message: "Select atleast one of PID Code or Production PN.",
                        modifiedDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 1219:
            msgobj = {
                messageBuildNumber: 1220,
                developer: "Champak",
                message: [
                    {
                        messageCode: "RCV40069",
                        messageKey: "TOTAL_RELEASE_RELEASECOUNT_MISMATC_CONFIRM",
                        messageType: "Confirmation",
                        message: "<b>Total Release Count</b> and <b>Qty</b> are modified and accordingly,<b>Total Release</b> will be modified. Are you sure you want to modify these release line details for PO# <b>{0}</b>?<br/>Press Yes to Continue.",
                        category: "RECEIVING",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "U"
                    }
                ]
            };
            break;
        case 1220:
            msgobj = {
                messageBuildNumber: 1221,
                developer: 'Kinjal',
                message: [{
                    messageCode: 'MST20052',
                    messageKey: 'NOT_MOVE_BETWEEN_DATA_SOURCE_SELECTION',
                    messageType: 'Error',
                    message: 'You are not allowed to update <b>{0}</b>. Reference transactions may exist for selected option!',
                    category: 'MASTER',
                    createdDate: new Date(COMMON.getCurrentUTC()),
                    action: 'U'
                }]
            };
            break;
        case 1221:
            msgobj = {
                messageBuildNumber: 1222,
                developer: 'Ketan',
                message: [{
                    messageCode: 'MFG40032',
                    messageKey: 'CUST_PACKING_SLIP_UMID_DEALLOCATE_FROM_OTHER_KIT_CONFM',
                    messageType: 'Confirmation',
                    message: 'Following UMID allocated in kit. Are you sure to de-allocate UMID from kit?',
                    category: 'MFG',
                    createdDate: new Date(COMMON.getCurrentUTC()),
                    action: 'I'
                }]
            };
            break;
        case 1222:
            msgobj = {
                messageBuildNumber: 1223,
                developer: 'Ketan',
                message: [{
                    messageCode: 'MFG20100',
                    messageKey: 'CUST_PACKING_SLIP_MISMATCH_AVAILABLE_QTY',
                    messageType: 'Error',
                    message: 'Available qty mismatch with existing ship data. Please refresh shipment details.',
                    category: 'MFG',
                    createdDate: new Date(COMMON.getCurrentUTC()),
                    action: 'I'
                }]
            };
            break;
        case 1223:
            msgobj = {
                messageBuildNumber: 1224,
                developer: 'Kinjal',
                message: [{
                    messageCode: 'MST20071',
                    messageKey: 'DATAELEMENT_MANUAL_DATA_NOT_SAVED',
                    messageType: 'Error',
                    message: 'Manual data not saved yet, To Save {0} details, please save manual data for field.',
                    category: 'MASTER',
                    createdDate: new Date(COMMON.getCurrentUTC()),
                    action: 'I'
                }]
            };
            break;
        case 1224:
            msgobj = {
                messageBuildNumber: 1225,
                developer: 'Shweta',
                message: [{
                    messageCode: 'MFG20101',
                    messageKey: 'PUBLISH_TRANSACTION_BEFORE_LOCK',
                    messageType: 'Error',
                    message: 'You can not lock record(s). Either record(s) already locked or in status {0}.',
                    category: 'MFG',
                    createdDate: new Date(COMMON.getCurrentUTC()),
                    action: 'I'
                }]
            };
            break;
        case 1225:
            msgobj = {
                messageBuildNumber: 1226,
                developer: 'Shweta',
                message: [{
                    messageCode: 'MFG40033',
                    messageKey: 'LOCK_RECORD_CONFIRMATION',
                    messageType: 'Confirmation',
                    message: 'Are you sure you want to lock selected record(s) ? Press Yes to continue.',
                    category: 'MFG',
                    createdDate: new Date(COMMON.getCurrentUTC()),
                    action: 'I'
                }]
            };
            break;
        case 1226:
            msgobj = {
                messageBuildNumber: 1227,
                developer: 'Shweta',
                message: [{
                    messageCode: 'MFG10012',
                    messageKey: 'LOCKED_SUCCESSFULLY',
                    messageType: 'Success',
                    message: '{0} locked successfully.',
                    category: 'MFG',
                    createdDate: new Date(COMMON.getCurrentUTC()),
                    action: 'I'
                }]
            };
            break;
        case 1227:
            msgobj = {
                messageBuildNumber: 1228,
                developer: 'Shweta',
                message: [{
                    messageCode: 'MFG20102',
                    messageKey: 'UNAUTHORISED_TO_LOCK',
                    messageType: 'Error',
                    message: 'You are not authorized to lock selected {0}.Please contanct administrator.',
                    category: 'MFG',
                    createdDate: new Date(COMMON.getCurrentUTC()),
                    action: 'I'
                }]
            };
            break;
        case 1228:
            msgobj = {
                messageBuildNumber: 1229,
                developer: 'Shweta',
                message: [
                    {
                        messageCode: 'MFG40016',
                        messageKey: 'CUSTOMER_INVOICE_STATUS_CHANGE',
                        messageType: 'Confirmation',
                        message: 'Are you sure to change customer invoice status from {0} to {1}? Press Yes to Continue.',
                        category: 'MFG',
                        modifiedDate: new Date(COMMON.getCurrentUTC()),
                        action: 'U'
                    }
                ]
            };
            break;
        case 1229:
            msgobj = {
                messageBuildNumber: 1230,
                developer: 'Shweta',
                message: [{
                    messageCode: 'MFG20103',
                    messageKey: 'CORRECTEDINVOICED_STATUS_CANNOT_CHANGED',
                    messageType: 'Error',
                    message: 'Action \'Change Status\'  is denied as Invoice is in \'Corrected And Invoiced\'.',
                    category: 'MFG',
                    createdDate: new Date(COMMON.getCurrentUTC()),
                    action: 'I'
                }]
            };
            break;
        case 1230:
            msgobj = {
                messageBuildNumber: 1231,
                developer: "Ashish",
                message: [
                    {
                        messageKey: "INVOICE_PAYMENT_AMOUNT_MUST_BE_GRATER_THAN_ZERO",
                        category: "RECEIVING",
                        messageType: "Error",
                        messageCode: "RCV20221",
                        message: "Payment amount must be greater than zero.",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 1231:
            msgobj = {
                messageBuildNumber: 1232,
                developer: "Ashish",
                message: [
                    {
                        messageKey: "INVOICE_PAYMENT_AMOUNT_SHOULD_NOT_GRATER_THAN_BALANCE_AMOUNT",
                        category: "RECEIVING",
                        messageType: "Error",
                        messageCode: "RCV20222",
                        message: "Payable amount should not be greater than <b>{0}</b>.",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 1232:
            msgobj = {
                messageBuildNumber: 1233,
                developer: "Ashish",
                message: [
                    {
                        messageKey: "DEBIT_CREDIT_MEMO_PAYMENT_AMOUNT_MUST_BE_LESS_THAN_ZERO",
                        category: "RECEIVING",
                        messageType: "Error",
                        messageCode: "RCV20223",
                        message: "Payment amount must be less than zero.",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 1233:
            msgobj = {
                messageBuildNumber: 1234,
                developer: "Ashish",
                message: [
                    {
                        messageKey: "DEBIT_CREDIT_MEMO_PAYMENT_AMOUNT_SHOULD_NOT_LESS_THAN_BALANCE_AMOUNT",
                        category: "RECEIVING",
                        messageType: "Error",
                        messageCode: "RCV20224",
                        message: "Payable amount should not be less than <b>{0}</b>.",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 1234:
            msgobj = {
                messageBuildNumber: 1235,
                developer: "Shweta",
                message: [
                    {
                        messageKey: "PAYMENT_RECEIVED_AGAINST_INVOICE",
                        category: "MFG",
                        messageType: "Error",
                        messageCode: "MFG20104",
                        message: "You can not update invoice as payment received against invoice.",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 1235:
            msgobj = {
                messageBuildNumber: 1236,
                developer: "Ashish",
                message: [
                    {
                        messageKey: "IN_CASE_OF_ZERO_PAYMENT_CHECK_PRINT_NOT_REQUIRED",
                        category: "RECEIVING",
                        messageType: "Information",
                        messageCode: "RCV50040",
                        message: "In case of zero payment check print not required!",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 1236:
            msgobj = {
                messageBuildNumber: 1237,
                developer: "Dharmishtha",
                message: [
                    {
                        messageCode: "RFQ20013",
                        messageKey: "VERIFY_SAVE_ERROR_TEXT",
                        messageType: "Error",
                        message: "Some information are still pending to verify. Possible reason is<br/><br/>1. Line Item and QPA must not null.<br/>2. MFR or MFRPN not added into internal database. Please 'Verify PN Externally'.<br/><br/>Please make sure you have valid and verified Line Item, QPA, MFR and MFR PN information.",
                        category: "RFQ",
                        modifiedDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 1237:
            msgobj = {
                messageBuildNumber: 1238,
                developer: "Dharmishtha",
                message: [
                    {
                        messageCode: "RFQ40022",
                        messageKey: "VERIFY_SAVE_TEXT",
                        messageType: "Confirmation",
                        message: "Some information are still pending to verify. Are you sure you want to continue with the filled information? Press Yes to Continue.",
                        category: "RFQ",
                        modifiedDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 1238:
            msgobj = {
                messageBuildNumber: 1239,
                developer: "Dharmishtha",
                message: [
                    {
                        messageCode: "RFQ20014",
                        messageKey: "MFG_EXISTS_TEXT",
                        messageType: "Error",
                        message: "Duplicate MFR PN found in same line item. Please delete any duplicate MFR PN before attempting to Save BOM.",
                        category: "RFQ",
                        modifiedDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 1239:
            msgobj = {
                messageBuildNumber: 1240,
                developer: "Dharmishtha",
                message: [
                    {
                        messageCode: "RFQ20015",
                        messageKey: "LINE_ITEMS_INVALID",
                        messageType: "Error",
                        message: "Please check there is some invalid line Items into current BOM.",
                        category: "RFQ",
                        modifiedDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 1240:
            msgobj = {
                messageBuildNumber: 1241,
                developer: "Dharmishtha",
                message: [
                    {
                        messageCode: "RFQ20016",
                        messageKey: "LINE_ITEMS_INVALID_DETAIL",
                        messageType: "Error",
                        message: "Please check there is some invalid line Items into current BOM.<br/><br/><b> Invalid line items(s): {0}</b>",
                        category: "RFQ",
                        modifiedDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 1241:
            msgobj = {
                messageBuildNumber: 1242,
                developer: "Dharmishtha",
                message: [
                    {
                        messageCode: "RFQ20017",
                        messageKey: "CUSTOMER_LINE_NUMBER_REQUIRED",
                        messageType: "Error",
                        message: "Require Customer BOM Line Number. Please Check. <br/> Following Item(s): <b>{0}</b>",
                        category: "RFQ",
                        modifiedDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 1242:
            msgobj = {
                messageBuildNumber: 1243,
                developer: "Dharmishtha",
                message: [
                    {
                        messageCode: "RFQ20018",
                        messageKey: "ASSEMBLY_CURR_EXISTS",
                        messageType: "Error",
                        message: "You cannot add same assembly <b>{0}</b> in BOM of assembly <b>({1}) {2}</b>.<br/> Same Assy# found in line Item <b>{3}</b>.",
                        category: "RFQ",
                        modifiedDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 1243:
            msgobj = {
                messageBuildNumber: 1244,
                developer: "Dharmishtha",
                message: [
                    {
                        messageCode: "RFQ20019",
                        messageKey: "ASSY_EXISTS_ALTERNATE_TEXT",
                        messageType: "Error",
                        message: "You cannot add assembly as alternate part. Please check below.<br/><b>Line Item(s): {0}</b>",
                        category: "RFQ",
                        modifiedDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 1244:
            msgobj = {
                messageBuildNumber: 1245,
                developer: "Shirish",
                message: [
                    {
                        messageCode: "RFQ20011",
                        messageKey: "LINE_ITEMS_EXISTS",
                        messageType: "Error",
                        message: "<h1><b>Duplicate item numbers are exists in BOM,</b></h1><br/>Please delete duplicate item number before to Save BOM.<br/><br/><strong> Duplicate Item Number found {0}. Item Number must be unique. </strong>",
                        category: "RFQ",
                        modifiedDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 1245:
            msgobj = {
                messageBuildNumber: 1246,
                developer: "Shirish",
                message: [
                    {
                        messageCode: "RFQ20012",
                        messageKey: "CUST_BOM_LINE_EXISTS",
                        messageType: "Error",
                        message: "<h1><b>Duplicate cust BOM line# are exists in BOM,</b></h1><br/>Please delete duplicate cust BOM line# before to Save BOM.<br/><br/><strong> Duplicate cust BOM line#  found {0}. Cust BOM line# must be unique. </strong>",
                        category: "RFQ",
                        modifiedDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 1246:
            msgobj = {
                messageBuildNumber: 1247,
                developer: "Shirish",
                message: [
                    {
                        messageCode: "RFQ40023",
                        messageKey: "DUPLICATE_PART_IN_DIFFERENT_LINE",
                        messageType: "Confirmation",
                        message: "<b><h3>Same parts exists into different line items.</h3></b><br/>Do you want to merge duplicate parts into single line?",
                        category: "RFQ",
                        modifiedDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 1247:
            msgobj = {
                messageBuildNumber: 1248,
                developer: "Fenil",
                message: [
                    {
                        messageCode: "RCV20225",
                        messageKey: "RMA_SHIIPED_QTY_NOT_GRETER_RMA_QTY",
                        messageType: "Error",
                        message: "<b>Shipped Qty</b> does not allow to greater than <b>RMA Qty</b>.",
                        category: "RECEIVING",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 1248:
            msgobj = {
                messageBuildNumber: 1249,
                developer: "Fenil",
                message: [
                    {
                        messageCode: "RCV20207",
                        messageKey: "SUPPLIER_RMA_ALREADY_CREATED",
                        messageType: "Error",
                        message: "Packing Slip# <b>{0}'s</b> supplier RMA is already created for supplier <b>{1}</b>.",
                        category: "RECEIVING",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "U"
                    }
                ]
            };
            break;
        case 1249:
            msgobj = {
                messageBuildNumber: 1250,
                developer: "Fenil",
                message: [
                    {
                        messageCode: "RCV20208",
                        messageKey: "RMA_NOT_DETAIL_LINE",
                        messageType: "Error",
                        message: "Packing Slip# <b>{0}</b> don't have single line of RMA material details. So you cannot get any detail of supplier RMA.",
                        category: "RECEIVING",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "U"
                    }
                ]
            };
            break;
        case 1250:
            msgobj = {
                messageBuildNumber: 1251,
                developer: "Fenil",
                message: [
                    {
                        messageCode: "RCV20209",
                        messageKey: "RMA_NOT_IN_SHIPPED_CREDIT_MEMO_NOT_CREATE",
                        messageType: "Error",
                        message: "You cannot create RMA credit memo as packing slip# <b>{0}</b> of supplier RMA is not in <b>Shipped</b> mode.",
                        category: "RECEIVING",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "U"
                    }
                ]
            };
            break;
        case 1251:
            msgobj = {
                messageBuildNumber: 1252,
                developer: "Fenil",
                message: [
                    {
                        messageCode: "RCV20226",
                        messageKey: "RMA_PS_NOT_MAPPED_SUPPLIER",
                        messageType: "Error",
                        message: "Packing Slip# <b>{0}</b> does not belong from the Selected supplier <b>{1}</b>.",
                        category: "RECEIVING",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 1252:
            msgobj = {
                messageBuildNumber: 1253,
                developer: "Ketan",
                message: [
                    {
                        messageCode: "GLB50025",
                        messageKey: "NO_RESULT_MATCH_FOR_APPLIED_CRITERIA",
                        messageType: "Information",
                        message: "No result matching for your search criteria.",
                        category: "GLOBAL",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 1253:
            msgobj = {
                messageBuildNumber: 1254,
                developer: "Ketan",
                message: [
                    {
                        messageCode: "MFG20106",
                        messageKey: "CUST_PAYMENT_DET_CHANGED_TRY_AGAIN",
                        messageType: "Error",
                        message: "Payment details already changed. Please refresh payment details.",
                        category: "MFG",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 1254:
            msgobj = {
                messageBuildNumber: 1255,
                developer: "Shweta",
                message: [
                    {
                        messageKey: "CUSTOMER_INVOICE_STATUS_CHANGE",
                        category: "MFG",
                        messageType: "Confirmation",
                        messageCode: "MFG40016",
                        message: "Are you sure to change customer invoice status from <b>{0}</b>? to <b>{1}</b>? Press Yes to Continue.",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "U"
                    }
                ]
            };
            break;
        case 1255:
            msgobj = {
                messageBuildNumber: 1256,
                developer: "Shweta",
                message: [
                    {
                        messageKey: "PUBLISH_TRANSACTION_BEFORE_LOCK",
                        category: "MFG",
                        messageType: "Error",
                        messageCode: "MFG20101",
                        message: "You can not lock record(s). Either record(s) already <b>Locked</b> or in status <b>{0}</b>.",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "U"
                    }
                ]
            };
            break;
        case 1256:
            msgobj = {
                messageBuildNumber: 1257,
                developer: "Fenil",
                message: [
                    {
                        messageCode: "RCV20227",
                        messageKey: "RECALCULATE_BOM_VERSION_GENERATED_AND_KIT_NOT_GENEARTED",
                        messageType: "Error",
                        message: "Current version of BOM is <b>{0}</b> and Kit is not generated. Please click on Recalculate button to generate Kit.",
                        category: "RECEIVING",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 1257:
            msgobj = {
                messageBuildNumber: 1258,
                developer: "Ashish",
                message: [
                    {
                        messageKey: "SELECT_ONLY_SUPPLIER_INVOICE_FOR_APPROVAL",
                        category: "RECEIVING",
                        messageType: "Error",
                        messageCode: "RCV20228",
                        message: "From selected record(s) some of them are not Invoice. Please check the selected record(s).",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 1258:
            msgobj = {
                messageBuildNumber: 1259,
                developer: "Ashish",
                message: [
                    {
                        messageKey: "SELECT_ONLY_PENDING_SUPPLIER_INVOICE_FOR_APPROVAL",
                        category: "RECEIVING",
                        messageType: "Error",
                        messageCode: "RCV20229",
                        message: "From selected invoice(s) some of them are already Approved. Please check the selected invoice(s).",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 1259:
            msgobj = {
                messageBuildNumber: 1260,
                developer: "Ashish",
                message: [
                    {
                        messageKey: "SELECTED_INVOICE_AND_DB_INVOICE_STATUS_NOT_MATCHED",
                        category: "RECEIVING",
                        messageType: "Error",
                        messageCode: "RCV20230",
                        message: "Status of selected Invoice(s) are not matched with actual data, please refresh your list and try again.",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 1260:
            msgobj = {
                messageBuildNumber: 1261,
                developer: "Ashish",
                message: [
                    {
                        messageKey: "SUPPLIER_INVOICE_APPROVED_SUCCESSFULLY",
                        category: "RECEIVING",
                        messageType: "Success",
                        messageCode: "RCV10008",
                        message: "Invoice(s) Approved successfully.",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 1261:
            msgobj = {
                messageBuildNumber: 1262,
                developer: "Ashish",
                message: [
                    {
                        messageKey: "SELECT_ONLY_SUPPLIER_INVOICE_FOR_APPROVAL",
                        category: "RECEIVING",
                        messageType: "Error",
                        messageCode: "RCV20228",
                        message: "From selected record(s) some of them are not <b>Invoice</b>. Please check the selected record(s).",
                        modifiedDate: new Date(COMMON.getCurrentUTC()),
                        action: "U"
                    }
                ]
            };
            break;
        case 1262:
            msgobj = {
                messageBuildNumber: 1263,
                developer: "Ashish",
                message: [
                    {
                        messageKey: "SELECT_ONLY_PENDING_SUPPLIER_INVOICE_FOR_APPROVAL",
                        category: "RECEIVING",
                        messageType: "Error",
                        messageCode: "RCV20229",
                        message: "From selected invoice(s) some of them are already <b>Approved</b>. Please check the selected invoice(s).",
                        modifiedDate: new Date(COMMON.getCurrentUTC()),
                        action: "U"
                    }
                ]
            };
            break;
        case 1263:
            msgobj = {
                messageBuildNumber: 1264,
                developer: 'Shweta',
                message: [{
                    messageCode: 'MFG20103',
                    messageKey: 'CORRECTEDINVOICED_STATUS_CANNOT_CHANGED',
                    messageType: 'Error',
                    message: 'Action \'Change Status\'  is denied as Invoice is in <b>\'Corrected And Invoiced\'</b> or <b>\'Invoiced\'</b>.',
                    category: 'MFG',
                    createdDate: new Date(COMMON.getCurrentUTC()),
                    action: 'U'
                }]
            };
            break;
        case 1264:
            msgobj = {
                messageBuildNumber: 1265,
                developer: "Shirish",
                message: [
                    {
                        messageCode: "RFQ20011",
                        messageKey: "LINE_ITEMS_EXISTS",
                        messageType: "Error",
                        message: "Duplicate <b>Line Item#(s)</b> are exists in BOM.<br/>Please delete duplicate Line Item# before saving BOM.<br/><br/><strong>Duplicate Line Item# found at {0}. Line Item# must be unique. </strong>",
                        category: "RFQ",
                        modifiedDate: new Date(COMMON.getCurrentUTC()),
                        action: "U"
                    }
                ]
            };
            break;
        case 1265:
            msgobj = {
                messageBuildNumber: 1266,
                developer: "Shirish",
                message: [
                    {
                        messageCode: "RFQ20012",
                        messageKey: "CUST_BOM_LINE_EXISTS",
                        messageType: "Error",
                        message: "Duplicate <b>Cust BOM line#</b> are exists in BOM.<br/>Please delete duplicate Cust BOM line# before saving BOM.<br/><br/><strong>Duplicate Cust BOM line#  found at {0}. Cust BOM line# must be unique. </strong>",
                        category: "RFQ",
                        modifiedDate: new Date(COMMON.getCurrentUTC()),
                        action: "U"
                    }
                ]
            };
            break;
        case 1266:
            msgobj = {
                messageBuildNumber: 1267,
                developer: "Shirish",
                message: [
                    {
                        messageCode: "RFQ40023",
                        messageKey: "DUPLICATE_PART_IN_DIFFERENT_LINE",
                        messageType: "Confirmation",
                        message: "<b><h3>Same parts exists into different line items.</h3></b><br/>Do you want to merge duplicate parts into single line?",
                        category: "RFQ",
                        modifiedDate: new Date(COMMON.getCurrentUTC()),
                        action: "U"
                    }
                ]
            };
            break;
        case 1267:
            msgobj = {
                messageBuildNumber: 1268,
                developer: "Fenil",
                message: [
                    {
                        messageCode: "MFG40035",
                        messageKey: "CONFIRMATION_DELETE_SALES_ORDER_DETAIL",
                        messageType: "Confirmation",
                        message: "{0} will be removed and if any stock allocated in any selected kit then it will be auto deallocated from kit. Press Yes to Continue.<br>Selected {1} {0} will be removed from list?",
                        category: "MFG",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 1268:
            msgobj = {
                messageBuildNumber: 1269,
                developer: "Fenil",
                message: [
                    {
                        messageCode: "MFG50056",
                        messageKey: "INFORMATION_DELETE_SALES_ORDER_DETAIL",
                        messageType: "Information",
                        message: "Sales order Assy ID <b>{0}</b> details cannot be remove due to following reasons:<br/>&nbsp;<b> 1.</b>&nbsp;Kit already released.<br/>&nbsp;<b> 2.</b>&nbsp;Work order already created.<br/>&nbsp;<b> 3.</b>&nbsp;Customer packing slip already generated.",
                        category: "MFG",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 1269:
            msgobj = {
                messageBuildNumber: 1270,
                developer: "Shweta",
                message: [
                    {
                        messageKey: "CUSTOMER_INVOICE_STATUS_CHANGE",
                        category: "MFG",
                        messageType: "Confirmation",
                        messageCode: "MFG40016",
                        message: "Are you sure to change customer invoice status from <b>{0}</b> to <b>{1}</b>? Press Yes to Continue.",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "U"
                    }
                ]
            };
            break;
        case 1270:
            msgobj = {
                messageBuildNumber: 1271,
                developer: "Shweta",
                message: [
                    {
                        messageKey: "DISCOUNT_NOT_MORE_THAN_INVOICE_TOTAL",
                        category: "MFG",
                        messageType: "Error",
                        messageCode: "MFG20107",
                        message: "Discount amount can not be more than Total Invoice Amount.",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 1271:
            msgobj = {
                messageBuildNumber: 1272,
                developer: "Ketan",
                message: [
                    {
                        messageCode: "GLB50026",
                        messageKey: "SEARCH_ITEM_NOT_EXIST_IN_LIST",
                        messageType: "Information",
                        message: "{0} <b>{1}</b> does not exist in given list.",
                        category: "GLOBAL",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 1272:
            msgobj = {
                messageBuildNumber: 1273,
                developer: "Ketan",
                message: [
                    {
                        messageCode: "GLB20055",
                        messageKey: "PLEASE_ENTER_VALID_FIELD_VALUE",
                        messageType: "Error",
                        message: "Please enter valid {0}.",
                        category: "GLOBAL",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 1273:
            msgobj = {
                messageBuildNumber: 1274,
                developer: "Ketan",
                message: [
                    {
                        messageCode: "MFG20108",
                        messageKey: "INV_AMT_NOT_MORE_THAN_ACTUAL_PAY_AMT",
                        messageType: "Error",
                        message: "Selected invoice amount is not more than actual payment amount. Please update invoice amount.",
                        category: "MFG",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 1274:
            msgobj = {
                messageBuildNumber: 1275,
                developer: "Shubham",
                message: [
                    {
                        messageCode: "GLB20056",
                        messageKey: "NO_RECORD_EXISTS_ON_UPLOAD_FILE",
                        messageType: "Error",
                        message: "Record does not exist.",
                        category: "GLOBAL",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 1275:
            msgobj = {
                messageBuildNumber: 1276,
                developer: "Dharmishtha",
                message: [
                    {
                        messageCode: "RFQ40023",
                        messageKey: "VERIFY_BOM_CONFIRAMTION",
                        messageType: "Confirmation",
                        message: "Current BOM have some errors in part(s). Are you sure you want to continure for <b>Pricing</b>? Press yes to continue.",
                        category: "RFQ",
                        modifiedDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;

        case 1276:
            msgobj = {
                messageBuildNumber: 1277,
                developer: "Charmi",
                message: [
                    {
                        messageCode: "GLB40030",
                        messageKey: "PERMENANT_DELETE_CONFIRM_MESSAGE",
                        messageType: "Confirmation",
                        message: "{0} will be removed permanently. Press Yes to Continue.<br>Selected {1} {0} will be removed permanently from list.",
                        category: "GLOBAL",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 1277:
            msgobj = {
                messageBuildNumber: 1278,
                developer: "Charmi",
                message: [
                    {
                        messageCode: "GLB10019",
                        messageKey: "FILE_FOLDER_RESTORE",
                        messageType: "Success",
                        message: "{0} restore successfully!",
                        category: "GLOBAL",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 1278:
            msgobj = {
                messageBuildNumber: 1279,
                developer: "Dharmishtha",
                message: [
                    {
                        messageCode: "RFQ40023",
                        messageKey: "VERIFY_BOM_CONFIRAMTION",
                        messageType: "Confirmation",
                        message: "Current BOM have some errors in part(s). Are you sure you want to continue for <b>Pricing</b>? Press yes to continue.",
                        category: "RFQ",
                        modifiedDate: new Date(COMMON.getCurrentUTC()),
                        action: "U"
                    }
                ]
            };
            break;
        case 1279:
            msgobj = {
                messageBuildNumber: 1280,
                developer: 'Vaibhav',
                message: [{
                    messageCode: 'MST20072',
                    messageKey: 'DATAELEMENT_KEYVALUE_REQUIRE',
                    messageType: 'Error',
                    message: 'To Save {0} details, Atleast one manual data must require in field.',
                    category: 'MASTER',
                    createdDate: new Date(COMMON.getCurrentUTC()),
                    action: 'I'
                }]
            };
            break;
        case 1280:
            msgobj = {
                messageBuildNumber: 1281,
                developer: "Fenil",
                message: [
                    {
                        messageCode: "RCV20229",
                        messageKey: "SELECT_ONLY_PENDING_SUPPLIER_INVOICE_FOR_APPROVAL",
                        messageType: "Error",
                        message: "From selected invoice(s) some of them are already <b>Approved</b> or <b>N/A</b>. Please check the selected invoice(s).",
                        category: "RECEIVING",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "U"
                    }
                ]
            };
            break;
        case 1281:
            msgobj = {
                messageBuildNumber: 1282,
                developer: "Fenil",
                message: [
                    {
                        messageCode: "RCV20231",
                        messageKey: "PAID_INVOICE_NOT_REQUIRE_FOR_APPROVAL",
                        messageType: "Error",
                        message: "From selected invoice(s) some of supplier invoice are already <b>Paid</b>. Please check the selected invoice(s).",
                        category: "RECEIVING",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 1282:
            msgobj = {
                messageBuildNumber: 1283,
                developer: "Vaibhav",
                message: [{
                    messageCode: "MST20073",
                    messageKey: "DELETE_NOT_ALLOW_FOR_MANUAL_DATA_SOURCE",
                    messageType: "Error",
                    message: "You are not allowed to delete option. Reference transactions may exist for <b>{0}</b>!",
                    category: "MASTER",
                    createdDate: new Date(COMMON.getCurrentUTC()),
                    action: "I"
                }]
            };
            break;
        case 1283:
            msgobj = {
                messageBuildNumber: 1284,
                developer: "Fenil",
                message: [
                    {
                        messageCode: "RCV20232",
                        messageKey: "NOT_PAY_DEBIT_MEMO_PARENT_INVOICE_NOT_APPROVE",
                        messageType: "Error",
                        message: "From selected record(s) debit memo# <b>{0}</b>'s ref. Invoice status is not <b>Approve To Pay</b> or <b>Paid</b>. Please check selected record(s).",
                        category: "RECEIVING",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 1284:
            msgobj = {
                messageBuildNumber: 1285,
                developer: "Dharmishtha",
                message: [
                    {
                        messageCode: "RCV50038",
                        messageKey: "NO_NEED_TO_PAY_FOR_CREDIT_OR_ZERO_DUE",
                        messageType: "Information",
                        message: "Selected record(s) total payment amount must be greater than zero.",
                        category: "RECEIVING",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "U"
                    }
                ]
            };
            break;
        case 1285:
            msgobj = {
                messageBuildNumber: 1286,
                developer: "Champak",
                message: [
                    {
                        messageCode: "MFG20109",
                        messageKey: "PO_ALREADY_EXIST_CUSTOMER",
                        messageType: "Error",
                        message: "PO# <b>{0}</b> already exists for Customer <b>{1}</b> and SO# <b>{2}</b>.",
                        category: "MFG",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 1286:
            msgobj = {
                messageBuildNumber: 1287,
                developer: 'Vaibhav',
                message: [{
                    messageCode: 'MST20072',
                    messageKey: 'DATAELEMENT_KEYVALUE_REQUIRE',
                    messageType: 'Error',
                    message: 'To save <b>{0}</b> details, Atleast one manual data must require in field.',
                    category: 'MASTER',
                    createdDate: new Date(COMMON.getCurrentUTC()),
                    action: 'U'
                }]
            };
            break;
        case 1287:
            msgobj = {
                messageBuildNumber: 1288,
                developer: "Fenil",
                message: [
                    {
                        messageCode: "RCV20233",
                        messageKey: "WITHOUT_SUPPLIER_RMA_DETAIL_NOT_ADD",
                        messageType: "Error",
                        message: "Without select any <b>Supplier</b> you cannot add any material details line. So please select supplier and save record for add material details.",
                        category: "RECEIVING",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 1288:
            msgobj = {
                messageBuildNumber: 1289,
                developer: "Shirish",
                message: [
                    {
                        messageCode: "RFQ20017",
                        messageKey: "CUSTOMER_LINE_NUMBER_REQUIRED",
                        messageType: "Error",
                        message: "<b>Cust BOM Line#</b> is required, Please Check. <br/><b>Following Item(s): <b>{0}.</b>",
                        category: "RFQ",
                        modifiedDate: new Date(COMMON.getCurrentUTC()),
                        action: "U"
                    }
                ]
            };
            break;
        case 1289:
            msgobj = {
                messageBuildNumber: 1290,
                developer: "Shweta",
                message: [
                    {
                        messageCode: "MFG20110",
                        messageKey: "CREDIT_MEMO_NOT_ALLOW_DELETE",
                        messageType: "Error",
                        message: "Selected credit memo either Published or Locked. You can not delete customer credit note.<br/> {0}",
                        category: "MFG",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 1290:
            msgobj = {
                messageBuildNumber: 1291,
                developer: "Shweta",
                message: [
                    {
                        messageCode: "MFG20111",
                        messageKey: "PUBLISH_WITHOUT_DETAILS",
                        messageType: "Error",
                        message: "To publish credit memo, you need to add details first.",
                        category: "MFG",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 1291:
            msgobj = {
                messageBuildNumber: 1292,
                developer: "Shweta",
                message: [
                    {
                        messageCode: "MFG20112",
                        messageKey: "CUSTOMER_INVOICE_POLINE_CANNOTUPDATE",
                        messageType: "Error",
                        message: "Invoice PO Line# cannot be updated in invoice detail.",
                        category: "MFG",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 1292:
            msgobj = {
                messageBuildNumber: 1293,
                developer: "Ketan",
                message: [{
                    messageCode: "MFG20093",
                    messageKey: "CREATE_NEW_PACKING_SLIP_ON_SHIP_ADDR_MISMATCH",
                    messageType: "Error",
                    message: "Selected release line shipping address/shipping method is mismatched with packing slip shipping address/shipping method. Are you sure want to continue?",
                    category: "MFG",
                    createdDate: new Date(COMMON.getCurrentUTC()),
                    action: "U"
                }]
            };
            break;
        case 1292:
            msgobj = {
                messageBuildNumber: 1293,
                developer: 'Shweta',
                message: [{
                    messageCode: 'MFG20103',
                    messageKey: 'CORRECTEDINVOICED_STATUS_CANNOT_CHANGED',
                    messageType: 'Error',
                    message: 'Action \'Change Status\'  is denied as Invoice is in <b>\'Corrected & Invoiced\'</b> or <b>\'Invoiced\'</b>.',
                    category: 'MFG',
                    createdDate: new Date(COMMON.getCurrentUTC()),
                    action: 'U'
                }]
            };
            break;
        case 1293:
            msgobj = {
                messageBuildNumber: 1294,
                developer: "Ashish",
                message: [
                    {
                        messageKey: "SUPPLIER_INVOICE_APPROVAL_VALIDATION_MESSAGE",
                        category: "RECEIVING",
                        messageType: "Error",
                        messageCode: "RCV20234",
                        message: "Supplier Invoice# <b>{0}</b> has not approved lines or has invoice variance, please check before approving the invoice.",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 1294:
            msgobj = {
                messageBuildNumber: 1295,
                developer: "Shweta",
                message: [
                    {
                        messageCode: "MFG20110",
                        messageKey: "CREDIT_MEMO_NOT_ALLOW_DELETE",
                        messageType: "Error",
                        message: "Selected credit memo either Published or Locked. You can not delete customer credit memo.<br/> {0}",
                        category: "MFG",
                        modifiedDate: new Date(COMMON.getCurrentUTC()),
                        action: "U"
                    }
                ]
            };
            break;
        case 1295:
            msgobj = {
                messageBuildNumber: 1296,
                developer: 'Shweta',
                message: [
                    {
                        messageCode: 'MFG40016',
                        messageKey: 'CUSTOMER_INVOICE_STATUS_CHANGE',
                        messageType: 'Confirmation',
                        message: 'Are you sure to change Customer {3} status from {0} to {1}? Press Yes to Continue.',
                        category: 'MFG',
                        modifiedDate: new Date(COMMON.getCurrentUTC()),
                        action: 'U'
                    }
                ]
            };
            break;
        case 1296:
            msgobj = {
                messageBuildNumber: 1297,
                developer: "Shweta",
                message: [
                    {
                        messageCode: "MFG20111",
                        messageKey: "PUBLISH_WITHOUT_DETAILS",
                        messageType: "Error",
                        message: "In prior to publish Credit Memo, you must have to fill up all required details of Credit Memo.",
                        category: "MFG",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "U"
                    }
                ]
            };
            break;
        case 1297:
            msgobj = {
                messageBuildNumber: 1298,
                developer: 'Shweta',
                message: [
                    {
                        messageCode: 'MFG40016',
                        messageKey: 'CUSTOMER_INVOICE_STATUS_CHANGE',
                        messageType: 'Confirmation',
                        message: 'Are you sure to change Customer {2} status from {0} to {1}? Press Yes to Continue.',
                        category: 'MFG',
                        modifiedDate: new Date(COMMON.getCurrentUTC()),
                        action: 'U'
                    }
                ]
            };
            break;
        case 1298:
            msgobj = {
                messageBuildNumber: 1299,
                developer: 'Vaibhav',
                message: [
                    {
                        messageCode: 'MFG20036',
                        messageKey: 'CUSTOMER_INVOICE_POLINE_NOTFOUND',
                        messageType: 'Error',
                        message: 'Invoice SO Line# not found in invoice detail.',
                        category: 'MFG',
                        modifiedDate: new Date(COMMON.getCurrentUTC()),
                        action: 'U'
                    }
                ]
            };
            break;
        case 1299:
            msgobj = {
                messageBuildNumber: 1300,
                developer: 'Champak',
                message: [
                    {
                        messageCode: 'MFG20115',
                        messageKey: 'ADDRESS_MAX_LENGTH_VALIDATION',
                        messageType: 'Error',
                        message: '<b>{0}:</b> Max {1} char, You have entered {2} char!',
                        category: 'MFG',
                        modifiedDate: new Date(COMMON.getCurrentUTC()),
                        action: 'I'
                    }
                ]
            };
            break;
        case 1300:
            msgobj = {
                messageBuildNumber: 1301,
                developer: "Ashish",
                message: [
                    {
                        messageKey: "PUSH_QUOTE_TO_PART_MASTER_CONFIRMATION",
                        category: "RFQ",
                        messageType: "Confirmation",
                        messageCode: "RFQ40025",
                        message: "Assembly sales price matrix data will be replaced with quote data. Are you sure you want to push quote data to the part master? Press yes to continue.",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 1301:
            msgobj = {
                messageBuildNumber: 1302,
                developer: "Ashish",
                message: [
                    {
                        messageKey: "QUOTE_DATA_PUSHED_SUCCESSFULLY",
                        category: "RFQ",
                        messageType: "Success",
                        messageCode: "RFQ10011",
                        message: "Quote data pushed successfully.",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 1302:
            msgobj = {
                messageBuildNumber: 1303,
                developer: "Shirish",
                message: [
                    {
                        messageCode: "RFQ40024",
                        messageKey: "LINE_DESCRIPTION_MISMATCH",
                        messageType: "Confirmation",
                        message: "Following line Description are mismatch. It will take only first line description. Are you sure want to Import BOM? <br/> Line items(s): {0}",
                        category: "RFQ",
                        modifiedDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 1303:
            msgobj = {
                messageBuildNumber: 1304,
                developer: "Shirish",
                message: [
                    {
                        messageCode: "RFQ40015",
                        messageKey: "WITHOUT_SAVING_ALERT_BODY_MESSAGE_ACTIVITY",
                        messageType: "Confirmation",
                        message: "You will lose all unsaved work.<br/> Are you sure you want to {0} activity?",
                        category: "RFQ",
                        modifiedDate: new Date(COMMON.getCurrentUTC()),
                        action: "U"
                    }
                ]
            };
            break;
        case 1304:
            msgobj = {
                messageBuildNumber: 1305,
                developer: "Shirish",
                message: [
                    {
                        messageCode: "RFQ40026",
                        messageKey: "DUPLICATE_PART_IN_DIFFERENT_LINE",
                        messageType: "Confirmation",
                        message: "<b><h3>Same parts exists into different line items.</h3></b><br/>Do you want to merge duplicate parts into single line?",
                        category: "RFQ",
                        modifiedDate: new Date(COMMON.getCurrentUTC()),
                        action: "U"
                    }
                ]
            };
            break;
        case 1305:
            msgobj = {
                messageBuildNumber: 1306,
                developer: "Ashish",
                message: [
                    {
                        messageKey: "SALES_COMMISSION_RESET_CONFIRMATION",
                        category: "MFG",
                        messageType: "Confirmation",
                        messageCode: "MFG40039",
                        message: "Are you sure to change <b>{0}</b>, this will reset sales commission? Press yes to continue.",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 1306:
            msgobj = {
                messageBuildNumber: 1307,
                developer: "Ketan",
                message: [
                    {
                        messageKey: "CUST_PAYMENT_VOID_REISSUE_SUCCESS",
                        category: "MFG",
                        messageType: "Success",
                        messageCode: "MFG10013",
                        message: "Customer payment {0} successfully.",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 1307:
            msgobj = {
                messageBuildNumber: 1308,
                developer: "Ketan",
                message: [
                    {
                        messageKey: "CUST_PAYMENT_WITH_DUPLICATE_PAY_CHECK_NO_CONFM",
                        category: "MFG",
                        messageType: "Confirmation",
                        messageCode: "MFG40037",
                        message: "Payment already received with <b>{0}</b> payment# or check#. You want to receive payment with same <b>{0}</b> payment# or check#?",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 1308:
            msgobj = {
                messageBuildNumber: 1309,
                developer: "Ketan",
                message: [
                    {
                        messageKey: "COPY_DOC_WHILE_REISSUE_PAYMENT_CONFM",
                        category: "MFG",
                        messageType: "Confirmation",
                        messageCode: "MFG40038",
                        message: "You are doing void & reissue payment. You want to copy documents?",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 1309:
            msgobj = {
                messageBuildNumber: 1310,
                developer: "Ketan",
                message: [
                    {
                        messageKey: "CUST_PAY_LOCKED_WITH_NO_ACCESS",
                        category: "MFG",
                        messageType: "Information",
                        messageCode: "MFG50057",
                        message: "Payment {0} is </b>locked</b>, Please contact to administrator.",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 1310:
            msgobj = {
                messageBuildNumber: 1311,
                developer: "Champak",
                message: [
                    {
                        messageKey: "PURCHASE_ORDER_REMOVE_RESTRICT_PACKING_SLIP",
                        category: "RECEIVING",
                        messageType: "Error",
                        messageCode: "RCV20235",
                        message: "You cannot remove the PO Line ID <b>{0}</b>, Because following packing slip(s) already generated and received the <b>{1}</b> qty against the selected PO Line qty <b>{2}</b>.",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 1311:
            msgobj = {
                messageBuildNumber: 1312,
                developer: "Champak",
                message: [
                    {
                        messageKey: "PURCHASE_ORDER_REMOVE_RESTRICT_PACKING_SLIP",
                        category: "RECEIVING",
                        messageType: "Error",
                        messageCode: "RCV20235",
                        message: "You cannot remove the PO Line ID <b>{0}</b>, Because following packing slip(s) already generated and received the <b>{1}</b> qty against the selected PO Line qty <b>{2}</b>.<br/><br/>Packing slip(s): <b>{3}</b>",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "U"
                    }
                ]
            };
            break;
        case 1312:
            msgobj = {
                messageBuildNumber: 1313,
                developer: "Champak",
                message: [
                    {
                        messageKey: "PURCHASE_ORDER_REMOVE_SHIPPING_RESTRICTION_PS",
                        category: "RECEIVING",
                        messageType: "Error",
                        messageCode: "RCV20236",
                        message: "You cannot remove the Release# <b>{0}</b>, Because following packing slip(s) already generated and received the <b>{1}</b> qty against the selected Release# qty <b>{2}</b>.<br/><br/>Packing slip(s): <b>{3}</b>",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 1313:
            msgobj = {
                messageBuildNumber: 1314,
                developer: "Champak",
                message: [
                    {
                        messageKey: "PURCHASE_ORDER_LINE_UPDATE_RESTRICT",
                        category: "RECEIVING",
                        messageType: "Error",
                        messageCode: "RCV20237",
                        message: "You cannot update the {0} <b>{1}</b>. Because it is already <b>Closed</b>.",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 1314:
            msgobj = {
                messageBuildNumber: 1315,
                developer: "Champak",
                message: [
                    {
                        messageKey: "PO_LINE_QTY_UPDATE_VALIDATION",
                        category: "RECEIVING",
                        messageType: "Error",
                        messageCode: "RCV20238",
                        message: "Packing Slip for {0} <b>{1}</b> already generated. You cannot reduce the {2} below the Packing Slip Qty <b>{3}</b>.",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 1315:
            msgobj = {
                messageBuildNumber: 1316,
                developer: "Champak",
                message: [
                    {
                        messageKey: "USER_STATUS_RESTRICT_PO_PACKING_SLIP",
                        category: "RECEIVING",
                        messageType: "Error",
                        messageCode: "RCV20239",
                        message: "Changing the PO status from <b>Published</b> to <b>Draft</b> is restricted as Packing Slip already created for selected PO.",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 1316:
            msgobj = {
                messageBuildNumber: 1317,
                developer: "Champak",
                message: [
                    {
                        messageKey: "CONFIRMATION_PURCHASE_LINE_STATUS_UPDATE",
                        category: "RECEIVING",
                        messageType: "Error",
                        messageCode: "RCV40073",
                        message: "Are you sure want to change the working status of PO Line <b>{0}</b> from <b>{1}</b> to <b>{2}</b>? Press Yes to Continue.",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 1317:
            msgobj = {
                messageBuildNumber: 1318,
                developer: "Champak",
                message: [
                    {
                        messageKey: "CONFIRMATION_PURCHASE_LINE_STATUS_UPDATE",
                        category: "RECEIVING",
                        messageType: "Error",
                        messageCode: "RCV40073",
                        message: "Are you sure want to change the working status of PO Line ID <b>{0}</b> from <b>{1}</b> to <b>{2}</b>? Press Yes to Continue.",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "U"
                    }
                ]
            };
            break;
        case 1318:
            msgobj = {
                messageBuildNumber: 1319,
                developer: "Purav",
                message: [
                    {
                        messageKey: "PO_STATUS_IN_DRAFT_MODE",
                        category: "RECEIVING",
                        messageType: "Information",
                        messageCode: "RCV50041",
                        message: "PurchaseOrder <b>{0}</b> is in draft mode. Please publish it to generate Packingslip.",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 1319:
            msgobj = {
                messageBuildNumber: 1320,
                developer: "Purav",
                message: [
                    {
                        messageKey: "PART_DO_NOT_EXIST_IN_PO_LINE",
                        category: "RECEIVING",
                        messageType: "Information",
                        messageCode: "RCV50042",
                        message: "You cannot add material detial for part <b>({0}) {1}</b> in this packing slip as selected part not available in associated PO# <b>{2}</b>.",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 1320:
            msgobj = {
                messageBuildNumber: 1321,
                developer: 'Shweta',
                message: [
                    {
                        messageCode: 'MFG40016',
                        messageKey: 'CUSTOMER_INVOICE_STATUS_CHANGE',
                        messageType: 'Confirmation',
                        message: 'Are you sure to change Customer {2} status from <b>{0}</b> to <b>{1}</b>? Press Yes to Continue.',
                        category: 'MFG',
                        modifiedDate: new Date(COMMON.getCurrentUTC()),
                        action: 'U'
                    }
                ]
            };
            break;
        case 1321:
            msgobj = {
                messageBuildNumber: 1322,
                developer: "Shweta",
                message: [
                    {
                        messageCode: "MFG20112",
                        messageKey: "CUSTOMER_INVOICE_POLINE_CANNOTUPDATE",
                        messageType: "Error",
                        message: "Invoice SO Line# cannot be updated in invoice detail.",
                        category: "MFG",
                        modifiedDate: new Date(COMMON.getCurrentUTC()),
                        action: "U"
                    }
                ]
            };
            break;
        case 1322:
            msgobj = {
                messageBuildNumber: 1323,
                developer: "Shweta",
                message: [
                    {
                        messageCode: "MFG20116",
                        messageKey: "CUSTOMER_INVOICE_BILLTO_SHIPTO_MISSING",
                        messageType: "Error",
                        message: "Please add <b>Ship To</b> and <b>Bill To</b> detail.",
                        category: "MFG",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 1323:
            msgobj = {
                messageBuildNumber: 1324,
                developer: "Shweta",
                message: [
                    {
                        messageCode: "MFG20117",
                        messageKey: "TRACKING_NUM_ENTERED_NOT_ADDED",
                        messageType: "Error",
                        message: "Tracking# is entered but not added yet. Do you want to continue?",
                        category: "MFG",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 1324:
            msgobj = {
                messageBuildNumber: 1325,
                developer: "Charmi",
                message: [
                    {
                        messageCode: "GLB40036",
                        messageKey: "WITHOUT_SAVING_RESET_BODY_MESSAGE",
                        messageType: "Confirmation",
                        message: "You will lose all unsaved work.<br/> Are you sure you want to reset this form?",
                        category: "GLOBAL",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 1325:
            msgobj = {
                messageBuildNumber: 1326,
                developer: "Ketan",
                message: [
                    {
                        messageCode: "MFG20118",
                        messageKey: "CUST_PAYMENT_ALREADY_VOIDED",
                        messageType: "Error",
                        message: "<b>{0}</b> payment# or check# already <b>voided</b>. Please check customer payment.",
                        category: "MFG",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 1326:
            msgobj = {
                messageBuildNumber: 1327,
                developer: "Champak",
                message: [
                    {
                        messageCode: "RCV40074",
                        messageKey: "CONFIRMATION_PURCHASE_LINE_RELEASE_STATUS_UPDATE",
                        messageType: "Error",
                        message: "Are you sure want to change the working status of Release# <b>{0}</b> from <b>{1}</b>  to <b>{2}</b>? Press Yes to Continue.",
                        category: "RECEIVING",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 1327:
            msgobj = {
                messageBuildNumber: 1328,
                developer: "Vaibhav",
                message: [
                    {
                        messageCode: "MFG50009",
                        messageKey: "INVALID_LINEID",
                        messageType: "Information",
                        message: "Invalid SO Line#",
                        category: "MFG",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "U"
                    }
                ]
            };
            break;
        case 1328:
            msgobj = {
                messageBuildNumber: 1329,
                developer: "Vaibhav",
                message: [
                    {
                        messageCode: "MFG50003",
                        messageKey: "INVALID_SHIPPING",
                        messageType: "Information",
                        message: "Total Release count(s) of the SO Line# {0} does not permit to add additional release line(s). <br/>Please either update Total Release in the SO Line# {0} or add additional release line(s).",
                        category: "MFG",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "U"
                    }
                ]
            };
            break;
        case 1329:
            msgobj = {
                messageBuildNumber: 1330,
                developer: "Vaibhav",
                message: [
                    {
                        messageCode: "MFG50050",
                        messageKey: "SO_SHIPPING_DET_REMOVE_VALIDATION",
                        messageType: "Information",
                        message: "Release Line ID <b>{0}</b> cannot be remove because, It is already shipped for customer packing slip(s) <b>{1}</b>.",
                        category: "MFG",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "U"
                    }
                ]
            };
            break;
        case 1330:
            msgobj = {
                messageBuildNumber: 1331,
                developer: "Vaibhav",
                message: [
                    {
                        messageCode: "MFG50052",
                        messageKey: "REMOVE_KIT_SAVE_INFORMATION",
                        messageType: "Information",
                        message: "SO Line# <b>{0}</b> AssyID <b>{1}</b> Kit <b>{2}</b>.",
                        category: "MFG",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "U"
                    }
                ]
            };
            break;
        case 1331:
            msgobj = {
                messageBuildNumber: 1332,
                developer: "Vaibhav",
                message: [
                    {
                        messageCode: "MFG50054",
                        messageKey: "INVALID_RELEASELINE",
                        messageType: "Error",
                        message: "Release line not allowed for other charges, Please enter valid SO Line# from sales order detail.",
                        category: "MFG",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "U"
                    }
                ]
            };
            break;
        case 1332:
            msgobj = {
                messageBuildNumber: 1333,
                developer: "Fenil",
                message: [
                    {
                        messageCode: "RCV20240",
                        messageKey: "CHECK_RMA_STOCK_RELATION_MESSAGE_RMA_GRID",
                        messageType: "Error",
                        message: "Have to transfer part from RMA Line to Bin first, after that able to delete RMA. Edit RMA and remove stock reference first.",
                        category: "RECEIVING",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 1333:
            msgobj = {
                messageBuildNumber: 1334,
                developer: "Fenil",
                message: [
                    {
                        messageCode: "RCV20241",
                        messageKey: "CHECK_RMA_STOCK_RELATION_MESSAGE_RMA_DETAIL_GRID",
                        messageType: "Error",
                        message: "In prior to delete transfer stock first.</br></br><ul><li>Pending UMID part: transfer part to last known bin to delete the line.</li><li>UMID part: transfer part to any bin to delete the line.</li></ul>",
                        category: "RECEIVING",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 1334:
            msgobj = {
                messageBuildNumber: 1335,
                developer: "Champak",
                message: [
                    {
                        messageCode: "RCV20242",
                        messageKey: "CHECK_RELEASE_QTY_RECEIVE_VALIDATION",
                        messageType: "Error",
                        message: "You cannot  merge the release(s) <b>{0}</b> as you already received the partial quantity for release(s) <b>{1}</b>.",
                        category: "RECEIVING",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 1335:
            msgobj = {
                messageBuildNumber: 1336,
                developer: "Champak",
                message: [
                    {
                        messageCode: "RCV20243",
                        messageKey: "CHECK_RELEASE_QTY_DIFFER_LINE_VALIDATION",
                        messageType: "Error",
                        message: "You cannot merge the PO Line ID <b>{0}</b> release(s) with <b>{1}</b>. You are allowed to merge the release for the same PO Line(s).",
                        category: "RECEIVING",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 1336:
            msgobj = {
                messageBuildNumber: 1337,
                developer: "Champak",
                message: [
                    {
                        messageCode: "RCV40075",
                        messageKey: "RELEASE_LINE_MERGE_CONFIRMATION",
                        messageType: "Confirmation",
                        message: "Are you sure you want to merge the release details of <b>{0}</b> with <b>{1}</b>? Press Yes to Continue.",
                        category: "RECEIVING",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 1337:
            msgobj = {
                messageBuildNumber: 1338,
                developer: "Fenil",
                message: [
                    {
                        messageCode: "RCV50003",
                        messageKey: "RE_CALCULATE_DELETE_ASSY",
                        messageType: "Information",
                        message: "Kit <b>{0}</b> removed by the user <b>{1}</b>. Because user <b>{1}</b> had removed the Sales Order details of sales order# <b>{2}</b> or enabled 'Do not Create Kit' checkbox.",
                        category: "RECEIVING",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "U"
                    }
                ]
            };
            break;
        case 1338:
            msgobj = {
                messageBuildNumber: 1339,
                developer: "Fenil",
                message: [
                    {
                        messageCode: "RCV50004",
                        messageKey: "RE_CALCULATE_CHANGE_SALESORDER",
                        messageType: "Information",
                        message: "User <b>{0}</b> have made some changes in <b>Assy ID</b> or <b>Kit Quantity</b> or <b>MRP Quantity</b> of Sales Order# <b>{1}</b> from sales order screen. Please do continue to apply changes in Kit Allocation.",
                        category: "RECEIVING",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "U"
                    }
                ]
            };
            break;
        case 1339:
            msgobj = {
                messageBuildNumber: 1340,
                developer: "Fenil",
                message: [
                    {
                        messageCode: "RCV20089",
                        messageKey: "KIT_RELEASE_DONE_MRP_KIT_QTY_NOT_CHANGE",
                        messageType: "Error",
                        message: "Kit Qty does not allow less then total qty of release plan. Please set kit qty same or greater than total qty of release plan.",
                        category: "RECEIVING",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "U"
                    }
                ]
            };
            break;
        case 1340:
            msgobj = {
                messageBuildNumber: 1341,
                developer: "Shubham",
                message: [
                    {
                        messageCode: "PRT40022",
                        messageKey: "CONFIRMATION_SAVE_PURCHASE_INSPECTION_TYPE",
                        messageType: "Confirmation",
                        message: "This part does contains some existing {0}, to append with them click on Append to Continue or to override existing click Override to Continue.",
                        category: "PARTS",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "U"
                    }
                ]
            };
            break;
        case 1341:
            msgobj = {
                messageBuildNumber: 1342,
                developer: "Purav",
                message: [
                    {
                        messageKey: "PART_DO_NOT_EXIST_IN_PO_LINE",
                        category: "RECEIVING",
                        messageType: "Information",
                        messageCode: "RCV50042",
                        message: "You cannot add material detial for part <b>({0}) {1}</b> in this packing slip as selected part not ordered in associated PO# <b>{2}</b>.",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "U"
                    }
                ]
            };
            break;
        case 1342:
            msgobj = {
                messageBuildNumber: 1343,
                developer: "Ketan",
                message: [
                    {
                        messageKey: "CUST_PAYMENT_PENDING_ADJUSTMENT_AMT_FOR_LOCK",
                        category: "MFG",
                        messageType: "Error",
                        messageCode: "MFG20122",
                        message: "Some of selected customer payment(s) contain pending adjustment amount. You can not lock.",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 1343:
            msgobj = {
                messageBuildNumber: 1344,
                developer: "Champak",
                message: [
                    {
                        messageKey: "PO_RESTRICT_FOR_PODATE",
                        category: "RECEIVING",
                        messageType: "Error",
                        messageCode: "RCV20244",
                        message: "You cannot change the PO Date. Because the material for PO# <b>{0}</b> was already received.",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 1344:
            msgobj = {
                messageBuildNumber: 1345,
                developer: "Purav",
                message: [
                    {
                        messageKey: "RECEIVING_AND_PACKINGSLIP_QTY_MISSMATCH_CONFIRMATION",
                        category: "RECEIVING",
                        messageType: "Confirmation",
                        messageCode: "RCV40076",
                        message: "<b>Packing Slip Qty</b> and <b>Received Qty</b> is mismatched. Are you sure you want to continue.",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 1345:
            msgobj = {
                messageBuildNumber: 1346,
                developer: "Ketan",
                message: [
                    {
                        messageKey: "COPY_DOC_WHILE_REISSUE_PAYMENT_CONFM",
                        category: "MFG",
                        messageType: "Confirmation",
                        messageCode: "MFG40038",
                        message: "You are doing void & re-receive payment. Do you want to copy documents from ref. payment# or check# \"{0}\"?",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "U"
                    }
                ]
            };
            break;
        case 1346:
            msgobj = {
                messageBuildNumber: 1347,
                developer: "Ketan",
                message: [
                    {
                        messageKey: "CUST_PAYMENT_ALREADY_LOCKED_FOR_LOCK",
                        category: "MFG",
                        messageType: "Error",
                        messageCode: "MFG20113",
                        message: "{0} customer payment(s) already <b>locked</b>. You can not lock again.",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "U"
                    }
                ]
            };
            break;
        case 1347:
            msgobj = {
                messageBuildNumber: 1348,
                developer: "Purav",
                message: [
                    {
                        messageKey: "SO_UNAVAILABLE_IN_SYSGEN_PO",
                        category: "RECEIVING",
                        messageType: "Confirmation",
                        messageCode: "RCV40077",
                        message: "PO#<b>{0}</b> does not have SO#. Please enter SO# in Purchase Order to continue.",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 1348:
            msgobj = {
                messageBuildNumber: 1349,
                developer: "Fenil",
                message: [
                    {
                        messageCode: "RCV20220",
                        messageKey: "RMA_QTY_SHIPPED_QTY_NOT_MORE_PS_QTY_RECEIVED_QTY",
                        messageType: "Error",
                        message: "<b>RMA Qty</b> and <b>Shipped Qty</b> does not allow more than Received Qty of Packing Slip# <b>{0}</b>.",
                        category: "RECEIVING",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "U"
                    }
                ]
            };
            break;
        case 1349:
            msgobj = {
                messageBuildNumber: 1350,
                developer: "Purav",
                message: [
                    {
                        messageCode: "RCV20245",
                        messageKey: "SO_UNAVAILABLE_IN_SYSGEN_PO",
                        messageType: "Error",
                        message: "PO# <b>{0}</b> doest not have SO#. Please enter SO# in Purchase order.",
                        category: "RECEIVING",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "U"
                    }
                ]
            };
            break;
        case 1350:
            msgobj = {
                messageBuildNumber: 1351,
                developer: "Shweta",
                message: [
                    {
                        messageCode: "GLB20058",
                        messageKey: "RESERVE_UMID_CANNOT_BE_CONSUMED",
                        messageType: "Error",
                        message: "Selected UMID is reserved for <b>{2}</b> customer. You can not {0} UMID <b>{1}</b>.",
                        category: "GLOBAL",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 1351:
            msgobj = {
                messageBuildNumber: 1352,
                developer: "Shweta",
                message: [
                    {
                        messageCode: "MFG20119",
                        messageKey: "UMID_ALREADY_FEEDER",
                        messageType: "Error",
                        message: "UMID {0} already allocated in feeder.",
                        category: "MFG",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 1352:
            msgobj = {
                messageBuildNumber: 1353,
                developer: "Shweta",
                message: [{
                    messageCode: "MFG40029",
                    messageKey: "CUSTOMER_SO_PACKING_SLIP_ADDRESS_SHIPPING_MISMATCH_CONFIRMATION",
                    messageType: "Confirmation",
                    message: "Packing Slip header shipping address/shipping method is mismatched with release line shipping address/shipping method. If you want to set release line shipping address/shipping method as packing slip header, Press \"KEEP LINE ADDRESS\". If you want to keep header shipping address/shipping method as packing slip header, Press \"KEEP HEADER ADDRESS\".",
                    category: "MFG",
                    modifiedDate: new Date(COMMON.getCurrentUTC()),
                    action: "U"
                }]
            };
            break;
        case 1353:
            msgobj = {
                messageBuildNumber: 1354,
                developer: "Shweta",
                message: [
                    {
                        messageCode: "MFG40040",
                        messageKey: "TRACKING_NUM_ENTERED_NOT_ADDED",
                        messageType: "Confirmation",
                        message: "Tracking# is entered but not added yet. Do you want to continue?",
                        category: "MFG",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "U"
                    }
                ]
            };
            break;
        case 1354:
            msgobj = {
                messageBuildNumber: 1355,
                developer: 'Shweta',
                message: [{
                    messageCode: 'MFG20101',
                    messageKey: 'PUBLISH_TRANSACTION_BEFORE_LOCK',
                    messageType: 'Error',
                    message: 'You can not lock record(s). Either record(s) already locked or in {1} status {0}.',
                    category: 'MFG',
                    modifiedDate: new Date(COMMON.getCurrentUTC()),
                    action: 'U'
                }]
            };
            break;
        case 1355:
            msgobj = {
                messageBuildNumber: 1356,
                developer: 'Shweta',
                message: [{
                    messageCode: 'MFG20123',
                    messageKey: 'SINGLE_LOCK_RECORD_ERROR',
                    messageType: 'Error',
                    message: 'You cannot lock record as it is already locked or in {1} status {0}.',
                    category: 'MFG',
                    createdDate: new Date(COMMON.getCurrentUTC()),
                    action: 'I'
                }]
            };
            break;
        case 1356:
            msgobj = {
                messageBuildNumber: 1357,
                developer: 'Shweta',
                message: [
                    {
                        messageCode: 'MFG20036',
                        messageKey: 'CUSTOMER_INVOICE_POLINE_NOTFOUND',
                        messageType: 'Error',
                        message: 'Invoice SO Line# {0} not found in invoice detail.',
                        category: 'MFG',
                        modifiedDate: new Date(COMMON.getCurrentUTC()),
                        action: 'U'
                    }
                ]
            };
            break;
        case 1357:
            msgobj = {
                messageBuildNumber: 1358,
                developer: 'Shweta',
                message: [
                    {
                        messageCode: 'MFG40041',
                        messageKey: 'DATA_ENTERED_NOT_ADDED',
                        messageType: 'Confirmation',
                        message: '{0} is entered but not added yet. Do you want to continue?',
                        category: 'MFG',
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: 'I'
                    }
                ]
            };
            break;
        case 1358:
            msgobj = {
                messageBuildNumber: 1359,
                developer: 'Shweta',
                message: [
                    {
                        messageCode: 'MFG20124',
                        messageKey: 'PACKING_SLIP_CANNOT_DELETED',
                        messageType: 'Error',
                        message: 'You cannot delete record(s).Few of record(s) already locked or invoiced.',
                        category: 'MFG',
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: 'I'
                    }
                ]
            };
            break;
        case 1359:
            msgobj = {
                messageBuildNumber: 1360,
                developer: 'Shweta',
                message: [{
                    messageCode: 'MFG20101',
                    messageKey: 'PUBLISH_TRANSACTION_BEFORE_LOCK',
                    messageType: 'Error',
                    message: 'You cannot lock record(s). Few of record(s) already <b>locked</b> or in {1} status <b>{0}</b>.',
                    category: 'MFG',
                    modifiedDate: new Date(COMMON.getCurrentUTC()),
                    action: 'U'
                }]
            };
            break;
        case 1360:
            msgobj = {
                messageBuildNumber: 1361,
                developer: "Shweta",
                message: [
                    {
                        messageCode: "MFG40011",
                        messageKey: "CUSTOMER_PACKINGTYPE_CONFIRMATION",
                        messageType: "Confirmation",
                        message: "All entered details will be lost, Are you sure want to continue? Press yes to continue.",
                        category: "MFG",
                        modifiedDate: new Date(COMMON.getCurrentUTC()),
                        action: "U"
                    }
                ]
            };
            break;
        case 1361:
            msgobj = {
                messageBuildNumber: 1362,
                developer: "Ketan",
                message: [
                    {
                        messageCode: "MFG10014",
                        messageKey: "CUST_PAYMENT_APPLIED_SUCCESS",
                        messageType: "Success",
                        message: "Customer payment applied successfully.",
                        category: "MFG",
                        modifiedDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 1362:
            msgobj = {
                messageBuildNumber: 1363,
                developer: "Ketan",
                message: [
                    {
                        messageCode: "MFG40042",
                        messageKey: "CUST_PAYMENT_INCLUDE_ZERO_AMT_INV_CONFM",
                        messageType: "Confirmation",
                        message: "Selected invoice(s) include zero amount invoice(s). Are you sure want to continue? Press Yes to Continue.",
                        category: "MFG",
                        modifiedDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 1363:
            msgobj = {
                messageBuildNumber: 1364,
                developer: "Ketan",
                message: [
                    {
                        messageCode: "MFG50058",
                        messageKey: "CUST_PAY_INV_ITEM_MAX_ALLOWED_AMT_INFO",
                        messageType: "Information",
                        message: "Invalid ${0} amount. You cannot enter amount more than ${1}.",
                        category: "MFG",
                        modifiedDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 1364:
            msgobj = {
                messageBuildNumber: 1365,
                developer: "Ketan",
                message: [
                    {
                        messageCode: "MFG50059",
                        messageKey: "INV_ALREADY_APPLIED_IN_CUST_PAYMENT",
                        messageType: "Information",
                        message: "Invoice {0} already selected and applied in payment.",
                        category: "MFG",
                        modifiedDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 1365:
            msgobj = {
                messageBuildNumber: 1366,
                developer: "Fenil",
                message: [
                    {
                        messageCode: "RCV20241",
                        messageKey: "CHECK_RMA_STOCK_RELATION_MESSAGE_RMA_DETAIL_GRID",
                        messageType: "Error",
                        message: "In prior to delete transfer stock first.</br></br><ul><li><b>Pending UMID part:</b> Transfer part to last known bin to delete the line.</li><li><b>UMID part:</b> Transfer part to any bin to delete the line.</li></ul>",
                        category: "RECEIVING",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "U"
                    }
                ]
            };
            break;
        case 1366:
            msgobj = {
                messageBuildNumber: 1367,
                developer: "Ashish",
                message: [
                    {
                        messageKey: "PUSH_QUOTE_TO_PART_MASTER_CONFIRMATION",
                        category: "RFQ",
                        messageType: "Confirmation",
                        messageCode: "RFQ40025",
                        message: "Sales price matrix data will be replaced with quote data. Are you sure you want to push quote data to the part master? Press yes to continue.",
                        modifiedDate: new Date(COMMON.getCurrentUTC()),
                        action: "U"
                    }
                ]
            };
            break;
        case 1367:
            msgobj = {
                messageBuildNumber: 1368,
                developer: "Charmi",
                message: [
                    {
                        messageCode: "RCV30012",
                        messageKey: "APPROVED_TO_DEALLOCATE_FROM_KIT_WARNING",
                        messageType: "Warning",
                        message: "consumption is more than allocated quantity and free to allocate quantity from UMID. So the system will be deallocated stock from below kits based on farthest allocated assembly DOCK date.",
                        category: "RECEIVING",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 1368:
            msgobj = {
                messageBuildNumber: 1369,
                developer: "Charmi",
                message: [
                    {
                        messageCode: "RCV30013",
                        messageKey: "COUNT_MATERIAL_WARNING_WITHOUT_SELECTED_KIT_FOR_DEALLOCATE",
                        messageType: "Warning",
                        message: "You did not selected any kit, so consumed quantity will create shortages and system will auto deallocate stock from Kit.",
                        category: "RECEIVING",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 1369:
            msgobj = {
                messageBuildNumber: 1370,
                developer: "Charmi",
                message: [
                    {
                        messageCode: "RCV30014",
                        messageKey: "COUNT_MATERIAL_SELECTED_COUNT_WARNING",
                        messageType: "Warning",
                        message: "{0} is more than <b>{1}%</b>. Double check {2} count.",
                        category: "RECEIVING",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 1370:
            msgobj = {
                messageBuildNumber: 1371,
                developer: "Charmi",
                message: [
                    {
                        messageCode: "RCV30015",
                        messageKey: "COUNT_MATERIAL_KIT_SELECTION_WARNING",
                        messageType: "Warning",
                        message: "Please select appropriate kit.",
                        category: "RECEIVING",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 1371:
            msgobj = {
                messageBuildNumber: 1372,
                developer: "Charmi",
                message: [
                    {
                        messageCode: "RCV30016",
                        messageKey: "COUNT_MATERIAL_ALLOCATE_KIT_COUNT_WARNING",
                        messageType: "Warning",
                        message: "{0} is more than <b>{1}%</b> of Allocated units. Double check {2} count.",
                        category: "RECEIVING",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 1372:
            msgobj = {
                messageBuildNumber: 1373,
                developer: "Charmi",
                message: [
                    {
                        messageCode: "RCV30017",
                        messageKey: "COUNT_MATERIAL_CONFIRMATION_KIT_NOT_RELEASED",
                        messageType: "Warning",
                        message: "Check with Supervisor as kit release is pending for allocated kit else consumed quantity may create shortage and system will deallocate stock from the kit.",
                        category: "RECEIVING",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 1373:
            msgobj = {
                messageBuildNumber: 1374,
                developer: "Charmi",
                message: [
                    {
                        messageCode: "RCV40039",
                        messageKey: "ADJUSTED_MATERIAL_MORE_THAN_CONFIGURED",
                        messageType: "Warning",
                        message: "Adjusted quantity is more than <b>{0}</b>. {1}",
                        category: "RECEIVING",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "U"
                    }
                ]
            };
            break;
        case 1374:
            msgobj = {
                messageBuildNumber: 1375,
                developer: "Charmi",
                message: [
                    {
                        messageCode: "RCV40040",
                        messageKey: "CONSUMED_MATERIAL_MORE_THAN_CONFIGURED",
                        messageType: "Warning",
                        message: "Consumed quantity is more than <b>{0}</b>. {1}",
                        category: "RECEIVING",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "U"
                    }
                ]
            };
            break;
        case 1375:
            msgobj = {
                messageBuildNumber: 1376,
                developer: "Charmi",
                message: [
                    {
                        messageCode: "RCV40036",
                        messageKey: "COUNT_MATERIAL_CONFIRMATION_WITHOUT_SELECTED_KIT",
                        messageType: "Confirmation",
                        category: "RECEIVING",
                        deletedDate: new Date(COMMON.getCurrentUTC()),
                        action: "D"
                    }
                ]
            };
            break;
        case 1376:
            msgobj = {
                messageBuildNumber: 1377,
                developer: "Charmi",
                message: [
                    {
                        messageCode: "RCV40035",
                        messageKey: "COUNT_MATERIAL_CONFIRMATION_WITHOUT_SELECTED_KIT_FOR_DEALLOCATE",
                        messageType: "Confirmation",
                        category: "RECEIVING",
                        deletedDate: new Date(COMMON.getCurrentUTC()),
                        action: "D"
                    }
                ]
            };
            break;
        case 1377:
            msgobj = {
                messageBuildNumber: 1378,
                developer: "Charmi",
                message: [
                    {
                        messageCode: "RCV40038",
                        messageKey: "STOCK_UPDATE_CONFIRMATION",
                        messageType: "Confirmation",
                        category: "RECEIVING",
                        deletedDate: new Date(COMMON.getCurrentUTC()),
                        action: "D"
                    }
                ]
            };
            break;
        case 1378:
            msgobj = {
                messageBuildNumber: 1379,
                developer: "Shweta",
                message: [
                    {
                        messageCode: "MFG20125",
                        messageKey: "CUST_REF_DEBIT_NUM_UNIQUE_PER_CUSTOMER",
                        messageType: "Error",
                        message: "Ref. Debit Memo# <b>{0}</b> must be unique for <b>{1}</b>.",
                        category: "MFG",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 1379:
            msgobj = {
                messageBuildNumber: 1380,
                developer: "Ketan",
                message: [
                    {
                        messageKey: "WITHOUT_SAVING_RESET_DEFINED_DET_MSG",
                        category: "GLOBAL",
                        messageType: "Confirmation",
                        messageCode: "GLB40037",
                        message: "You will lose all unsaved work.<br/> Are you sure you want to reset {0}?",
                        modifiedDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 1380:
            msgobj = {
                messageBuildNumber: 1381,
                developer: "Ketan",
                message: [
                    {
                        messageKey: "CUST_PAYMENT_PENDING_ADJUSTMENT_AMT_FOR_LOCK",
                        category: "MFG",
                        messageType: "Error",
                        messageCode: "MFG20122",
                        message: "{0} customer payment(s) contain pending adjustment amount. You can not lock.",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "U"
                    }
                ]
            };
            break;
        case 1381:
            msgobj = {
                messageBuildNumber: 1382,
                developer: 'Ketan',
                message: [{
                    messageCode: 'MFG20092',
                    messageKey: 'INVALID_WO_SERIES',
                    messageType: 'Error',
                    message: 'Invalid WO# Series. Please enter WO# with {0} series.',
                    category: 'MFG',
                    createdDate: new Date(COMMON.getCurrentUTC()),
                    action: 'U'
                }]
            };
            break;
        case 1382:
            msgobj = {
                messageBuildNumber: 1383,
                developer: "Vaibhav",
                message: [
                    {
                        messageCode: "MFG20056",
                        messageKey: "WO_EXISTS_IN_OPENING_PART_BAL_FOR_SAVE_IN_PROD",
                        messageType: "Error",
                        message: "WO# {0} already created for initial stock. Please add different WO# for production.",
                        category: "MFG",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "U"
                    }
                ]
            };
            break;
        case 1383:
            msgobj = {
                messageBuildNumber: 1384,
                developer: 'Vaibhav',
                message: [{
                    messageCode: 'MFG20091',
                    messageKey: 'WO_SERIES_ALREADY_EXISTS',
                    messageType: 'Error',
                    message: 'WO Series <b>{0}</b> already exists. Please add different WO Series for initial stock.',
                    category: 'MFG',
                    createdDate: new Date(COMMON.getCurrentUTC()),
                    action: 'U'
                }]
            };
            break;
        case 1384:
            msgobj = {
                messageBuildNumber: 1385,
                developer: 'Vaibhav',
                message: [
                    {
                        messageCode: 'MFG20051',
                        messageKey: 'WO_EXISTS_IN_PROD_FOR_SAVE_OPENING_PART_BAL',
                        messageType: 'Error',
                        message: 'WO# {0} already created for production. Please add different WO# for initial stock.',
                        category: 'MFG',
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: 'U'
                    }
                ]
            };
            break;
        case 1385:
            msgobj = {
                messageBuildNumber: 1386,
                developer: "Shirish",
                message: [
                    {
                        messageCode: "RFQ50030",
                        messageKey: "SEARCH_DATA_NOT_FOUND",
                        messageType: "Information",
                        message: "Not found any matching content.",
                        category: "RFQ",
                        modifiedDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 1386:
            msgobj = {
                messageBuildNumber: 1387,
                developer: "Ashish",
                message: [
                    {
                        messageKey: "SHIPPING_ADDRESS_NOT_ADDED_YET",
                        category: "RECEIVING",
                        messageType: "Information",
                        messageCode: "RCV50043",
                        message: "No shipping address added yet.",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 1387:
            msgobj = {
                messageBuildNumber: 1388,
                developer: "Ashish",
                message: [
                    {
                        messageKey: "PAY_TO_ADDRESS_NOT_ADDED_YET",
                        category: "RECEIVING",
                        messageType: "Information",
                        messageCode: "RCV50044",
                        message: "No pay to address added yet.",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 1388:
            msgobj = {
                messageBuildNumber: 1389,
                developer: "Jay",
                message: [
                    {
                        messageKey: "SYSTEMTYPE_NOT_EXISTS",
                        category: "MASTER",
                        messageType: "Error",
                        messageCode: "MST20074",
                        message: "{0} Type not exists! Please contact to administrator.",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 1389:
            msgobj = {
                messageBuildNumber: 1390,
                developer: "Shubham",
                message: [
                    {
                        messageKey: "SAVE_QUOTE_DETAIL_FOR_REQUOTE",
                        category: "PARTS",
                        messageType: "Information",
                        messageCode: "PRT50016",
                        message: "You cannot Re-Quote as there are unsaved data in Sales Price Matrix. Please save the changes and process for Re-Quote.",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 1390:
            msgobj = {
                messageBuildNumber: 1391,
                developer: "Shubham",
                message: [
                    {
                        messageKey: "REQUOTE_SALES_COMMISSION_ALL_DATA_CONFIRMATION",
                        category: "PARTS",
                        messageType: "Confirmation",
                        messageCode: "PRT40034",
                        message: "Are you sure to re-quote Sales Price Matrix? Press Yes to Continue.",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 1391:
            msgobj = {
                messageBuildNumber: 1392,
                developer: "Shubham",
                message: [
                    {
                        messageKey: "REVERT_HISTORY_QUOTE_CONFIRMATION",
                        category: "PARTS",
                        messageType: "Confirmation",
                        messageCode: "PRT40035",
                        message: "You had entered the <b>{0}</b> which is already exisit in history. Would you like to retrieve the quote from the history and set it as a current quote?",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 1392:
            msgobj = {
                messageBuildNumber: 1393,
                developer: "Shubham",
                message: [
                    {
                        messageKey: "SAVE_PART_DETAIL_FOR_CREATEDUPLICATE_PART",
                        category: "PARTS",
                        messageType: "Information",
                        messageCode: "PRT50017",
                        message: "Some information(s) from the Part are unsaved. Please save and try again",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;

        case 1393:
            msgobj = {
                messageBuildNumber: 1394,
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


        case 1394:
            msgobj = {
                messageBuildNumber: 1395,
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

        case 1395:
            msgobj = {
                messageBuildNumber: 1396,
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
        case 1396:
            msgobj = {
                messageBuildNumber: 1397,
                developer: "Shubham",
                message: [
                    {
                        messageCode: "PRT40036",
                        messageKey: "PART_REQUIREMENT_CATEGORY_UPDATE_CONFIRMATION_MESSAGE",
                        messageType: "Confirmation",
                        message: "Are you sure to update selected part requirement(s) category and status? Press Yes to Continue.",
                        category: "PARTS",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 1397:
            msgobj = {
                messageBuildNumber: 1398,
                developer: "Shirish",
                message: [
                    {
                        messageCode: "RFQ40027",
                        messageKey: "DELETE_BOM_CONFIRMATION",
                        messageType: "Confirmation",
                        message: "Are you sure you want to delete BOM? <br/> {0} will be removed. Press Yes to Continue.",
                        category: "RFQ",
                        modifiedDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 1398:
            msgobj = {
                messageBuildNumber: 1399,
                developer: "Charmi",
                message: [
                    {
                        messageCode: "GLB40009",
                        messageKey: "NOT_ADDED_CONFRIMATION",
                        messageType: "Confirmation",
                        message: "{0} is not added yet. Do you want to continue?",
                        category: "GLOBAL",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 1399:
            msgobj = {
                messageBuildNumber: 1400,
                developer: "Shubham",
                message: [
                    {
                        messageKey: "SAVE_PART_DETAIL_FOR_CREATEDUPLICATE_PART",
                        category: "PARTS",
                        messageType: "Information",
                        messageCode: "PRT50017",
                        message: "Some information(s) from part details are unsaved, please save them and try again.",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "U"
                    }
                ]
            };
            break;
        case 1400:
            msgobj = {
                messageBuildNumber: 1401,
                developer: "Ashish",
                message: [
                    {
                        messageKey: "SUPPLIER_RMA_STOCK_QTY_CHANGED",
                        category: "RECEIVING",
                        messageType: "Error",
                        messageCode: "RCV20253",
                        message: "<b>Available Qty</b> mismatched with existing RMA stock data. Please refresh RMA stock data once.",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 1401:
            msgobj = {
                messageBuildNumber: 1402,
                developer: "Ketan",
                message: [
                    {
                        messageKey: "PROD_WO_PATTERN_NOT_ALLOWED_FOR_OTHER_WO_NUM",
                        category: "MFG",
                        messageType: "Information",
                        messageCode: "MFG50061",
                        message: "WO# pattern WOXXXXX-XX not allowed for initial stock. Please change WO# pattern in prior to add initial stock.",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 1402:
            msgobj = {
                messageBuildNumber: 1403,
                developer: "Shirish",
                message: [
                    {
                        messageCode: "RFQ20020",
                        messageKey: "LINE_UOM_INVALID_DETAIL",
                        messageType: "Error",
                        message: "Please check there is some invalid UOM at following line Items into current BOM.",
                        category: "RFQ",
                        modifiedDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 1403:
            msgobj = {
                messageBuildNumber: 1404,
                developer: "Jay",
                message: [
                    {
                        messageKey: "PREVENT_UPDATE_PARENT_ACCOUNT",
                        category: "GLOBAL",
                        messageType: "Error",
                        messageCode: "GLB20060",
                        message: "The <b>{0}</b> is already a Sub Account of <b>{1}</b>, so you can not make <b>{0}</b> as Parent Account{2}.",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 1404:
            msgobj = {
                messageBuildNumber: 1405,
                developer: "Jay",
                message: [
                    {
                        messageKey: "PREVENT_UPDATE_PARENT_ACCOUNT",
                        category: "GLOBAL",
                        messageType: "Error",
                        messageCode: "GLB20060",
                        message: "The <b>{0}</b> is already a Sub Account of <b>{1}</b>, so you can not make <b>{0}</b> as Parent Account{2}.",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "U"
                    }
                ]
            };
            break;
        case 1405:
            msgobj = {
                messageBuildNumber: 1406,
                developer: "Ashish",
                message: [
                    {
                        messageKey: "DB_TRANSACTION_LOCKED_MESSAGE",
                        category: "GLOBAL",
                        messageType: "Error",
                        messageCode: "GLB20061",
                        message: "The transaction is locked for some time due to excessive requests, please try again!",
                        modifiedDate: new Date(COMMON.getCurrentUTC()),
                        action: "U"
                    }
                ]
            };
            break;
        case 1406:
            msgobj = {
                messageBuildNumber: 1407,
                developer: "Charmi",
                message: [
                    {
                        messageCode: "RCV20255",
                        messageKey: "NOT_ALLOWED_TO_PUBLISH_QUOTE",
                        messageType: "Error",
                        message: "Prior to publish please add at least one price detail for each part in this quote.",
                        category: "RECEIVING",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 1407:
            msgobj = {
                messageBuildNumber: 1408,
                developer: "Ashish",
                message: [
                    {
                        messageKey: "SUPPLIER_TRANSACTION_IS_ALREADY_LOCKED",
                        category: "RECEIVING",
                        messageType: "Error",
                        messageCode: "RCV20256",
                        message: "You can not lock record(s). Either record(s) are already <b>Locked</b> or in a <b>Not Applicable</b> state.",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 1408:
            msgobj = {
                messageBuildNumber: 1409,
                developer: "Ashish",
                message: [
                    {
                        messageKey: "SUPPLIER_TRANSACTION_DELETE_VALIDATION_FOR_LOCKED_TRANSACTIONS",
                        category: "RECEIVING",
                        messageType: "Error",
                        messageCode: "RCV20257",
                        message: "You can not delete selected record(s), as from selected record(s) some record(s) are <b>Locked</b>.",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 1409:
            msgobj = {
                messageBuildNumber: 1410,
                developer: "Dharmishtha",
                message: [
                    {
                        messageCode: "RCV20255",
                        messageKey: "NOT_ALLOWED_TO_PUBLISH_QUOTE",
                        messageType: "Error",
                        message: "Must fill <b>Part Pricing</b> for each line prior to publishing.",
                        category: "RECEIVING",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "U"
                    }
                ]
            };
            break;
        case 1410:
            msgobj = {
                messageBuildNumber: 1411,
                developer: "Ashish",
                message: [
                    {
                        messageCode: "MFG40033",
                        messageKey: "LOCK_RECORD_CONFIRMATION",
                        messageType: "Confirmation",
                        category: "MFG",
                        deletedDate: new Date(COMMON.getCurrentUTC()),
                        action: "D"
                    }
                ]
            };
            break;
        case 1411:
            msgobj = {
                messageBuildNumber: 1412,
                developer: "Ashish",
                message: [
                    {
                        messageCode: "MFG10012",
                        messageKey: "LOCKED_SUCCESSFULLY",
                        messageType: "Success",
                        category: "MFG",
                        deletedDate: new Date(COMMON.getCurrentUTC()),
                        action: "D"
                    }
                ]
            };
            break;
        case 1412:
            msgobj = {
                messageBuildNumber: 1413,
                developer: "Ashish",
                message: [
                    {
                        messageKey: "LOCK_RECORD_CONFIRMATION",
                        category: "GLOBAL",
                        messageType: "Confirmation",
                        messageCode: "GLB40041",
                        message: "Are you sure you want to lock selected record(s) ? Press Yes to continue.",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 1413:
            msgobj = {
                messageBuildNumber: 1414,
                developer: "Ashish",
                message: [
                    {
                        messageKey: "LOCKED_SUCCESSFULLY",
                        category: "GLOBAL",
                        messageType: "Success",
                        messageCode: "GLB10020",
                        message: "{0} locked successfully.",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 1414:
            msgobj = {
                messageBuildNumber: 1415,
                developer: "Jay",
                message: [
                    {
                        messageKey: "PO_ALREADY_CANCELED",
                        category: "RECEIVING",
                        messageType: "Confirmation",
                        messageCode: "RCV40084",
                        message: "PO# <b>{0}</b> is already canceled and parts from the canceled PO will be received as a Rejected Parts. Are you sure you want to proceed further to create Material Receipt?",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 1415:
            msgobj = {
                messageBuildNumber: 1416,
                developer: "Ashish",
                message: [
                    {
                        messageKey: "CONFIRMATION_CONNTINUE_TR_UMID_COUNT",
                        category: "RECEIVING",
                        messageType: "Confirmation",
                        messageCode: "RCV40051",
                        message: "Entered count quantity is mismatched with the UMID SPQ of part <b>{0}({1})</b> which is configured in Part Master. Are you sure you want to continue or press change packaging for change the packaging value.",
                        modifiedDate: new Date(COMMON.getCurrentUTC()),
                        action: "U"
                    }
                ]
            };
            break;
        case 1416:
            msgobj = {
                messageBuildNumber: 1417,
                developer: "Shirish",
                message: [
                    {
                        messageCode: "RFQ50031",
                        messageKey: "APPROVE_PART_PRIOR_TO_MAPPING",
                        messageType: "Information",
                        message: "In prior to mapping part required engineering approval. Please approve from BOM and try again.",
                        category: "RFQ",
                        modifiedDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 1417:
            msgobj = {
                messageBuildNumber: 1418,
                developer: "Jay",
                message: [
                    {
                        messageCode: "RCV30020",
                        messageKey: "CHANGE_PO_PUBLISHED_FOR_CANCEL_PO",
                        messageType: "Warning",
                        message: "PO# {0} Working status is <b>DRAFT</b>. Please change the PO Working Status to <b> PUBLISHED</b> to perform the Cancellation action.",
                        category: "RECEIVING",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 1418:
            msgobj = {
                messageBuildNumber: 1419,
                developer: "Ashish",
                message: [
                    {
                        messageKey: "CONFIRMATION_CONNTINUE_TR_UMID_COUNT",
                        category: "RECEIVING",
                        messageType: "Confirmation",
                        messageCode: "RCV40051",
                        message: "Entered {0} is mismatched with the UMID SPQ of part <b>{1}({2})</b> which is configured in Part Master. Are you sure you want to continue or press change packaging for change the packaging value.",
                        modifiedDate: new Date(COMMON.getCurrentUTC()),
                        action: "U"
                    }
                ]
            };
            break;
        case 1419:
            msgobj = {
                messageBuildNumber: 1420,
                developer: "Shubham",
                message: [
                    {
                        messageKey: "INVALID_CUSTOMER_FOR_CPN_PART",
                        category: "PARTS",
                        messageType: "Error",
                        messageCode: "PRT20042",
                        message: "Selected MFR Code <b>{0}</b> is not a <b>Customer</b>, please select <b>Customer</b> to create <b>CPN Part</b>.",
                        modifiedDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 1420:
            msgobj = {
                messageBuildNumber: 1421,
                developer: "Jay",
                message: [
                    {
                        messageKey: "UNDO_CANCELLATION_CONFIRMATION",
                        category: "RECEIVING",
                        messageType: "Confirmation",
                        messageCode: "RCV40085",
                        message: "Are you sure, you want to undo the cancellation of the PO# <b>{0}</b>?",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 1421:
            msgobj = {
                messageBuildNumber: 1422,
                developer: "Purav",
                message: [
                    {
                        messageKey: "CONFIRMATION_SAVE_CUSTOMER_COMMENT",
                        category: "GLOBAL",
                        messageType: "Confirmation",
                        messageCode: "GLB40043",
                        message: "This {0} does contains some existing comments, to append with them click on Append to Continue or to override existing click Override to Continue.",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 1422:
            msgobj = {
                messageBuildNumber: 1423,
                developer: "Shubham",
                message: [
                    {
                        messageKey: "FROM_PART_NOT_FOUND",
                        category: "PARTS",
                        messageType: "Error",
                        messageCode: "PRT20043",
                        message: "From part not found.",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 1423:
            msgobj = {
                messageBuildNumber: 1424,
                developer: "Ashish",
                message: [
                    {
                        messageKey: "CPN_NOT_ALLOW",
                        category: "RECEIVING",
                        messageType: "Error",
                        messageCode: "RCV20079",
                        message: "Scanned <b>{0}</b> is CPN. So, It is not allowed to scan in the <b>Purchased Part</b> category.<br>Please select the <b>Customer Consigned (With CPN) Part</b> category to scan CPN part#.",
                        modifiedDate: new Date(COMMON.getCurrentUTC()),
                        action: "U"
                    }
                ]
            };
            break;
        case 1424:
            msgobj = {
                messageBuildNumber: 1425,
                developer: "Jay",
                message: [
                    {
                        messageKey: "PO_ALREADY_CANCELED",
                        category: "RECEIVING",
                        messageType: "Confirmation",
                        messageCode: "RCV40084",
                        message: "PO# <b>{0}</b> is already <b>canceled</b> and parts from the <b>canceled PO</b> will be received as a <b>Rejected Parts</b>. Are you sure you want to proceed further to create Material Receipt?",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "U"
                    }
                ]
            };
            break;
        case 1425:
            msgobj = {
                messageBuildNumber: 1426,
                developer: "Heena",
                message: [
                    {
                        messageCode: "PRT40036",
                        messageKey: "PART_REQUIREMENT_CATEGORY_UPDATE_CONFIRMATION_MESSAGE",
                        messageType: "Confirmation",
                        message: "Are you sure to update selected Requirement & Comments category and status? Press Yes to Continue.",
                        category: "PARTS",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "U"
                    }
                ]
            };
            break;
        case 1426:
            msgobj = {
                messageBuildNumber: 1427,
                developer: "Ashish",
                message: [
                    {
                        messageKey: "CONFIRMATION_CONNTINUE_TR_UMID_COUNT",
                        category: "RECEIVING",
                        messageType: "Confirmation",
                        messageCode: "RCV40051",
                        message: "<h2>Mismatch!<h2>{0} of <b>{2}</b> part must be multiple of Part Master UMID SPQ of part <b>{1}</b>.<br><b>A)</b> Press <b>CHANGE {3}</b> to change the {0} to multiple of UMID SPQ.<br><b>B)</b> Press <b>CHANGE PACKAGING</b> to change the Packaging other than {2}.<br><b>C)</b> Press <b>CONTINUE</b> to accept the entered {0} and {2} as a Packaging.",
                        modifiedDate: new Date(COMMON.getCurrentUTC()),
                        action: "U"
                    }
                ]
            };
            break;
        case 1427:
            msgobj = {
                messageBuildNumber: 1428,
                developer: "Ashish",
                message: [
                    {
                        messageKey: "CONFIRMATION_CONNTINUE_TR_UMID_COUNT",
                        category: "RECEIVING",
                        messageType: "Confirmation",
                        messageCode: "RCV40051",
                        message: "<h2>Mismatch!</h2>{0} of <b>{2}</b> part must be multiple of Part Master UMID SPQ of part <b>{1}</b>.<br><b>A)</b> Press <b>CHANGE {3}</b> to change the {0} to multiple of UMID SPQ.<br><b>B)</b> Press <b>CHANGE PACKAGING</b> to change the Packaging other than {2}.<br><b>C)</b> Press <b>CONTINUE</b> to accept the entered {0} and {2} as a Packaging.",
                        modifiedDate: new Date(COMMON.getCurrentUTC()),
                        action: "U"
                    }
                ]
            };
            break;
        case 1428:
            msgobj = {
                messageBuildNumber: 1429,
                developer: "Shirish",
                message: [
                    {
                        messageCode: "RFQ50032",
                        messageKey: "WITHOUT_SAVING_ALERT_BODY_MESSAGE_PROGRAM_MAPPING",
                        messageType: "Information",
                        message: "Please save changes in prior to part program mapping.",
                        category: "RFQ",
                        modifiedDate: new Date(COMMON.getCurrentUTC()),
                        action: "U"
                    }
                ]
            };
            break;
        case 1429:
            msgobj = {
                messageBuildNumber: 1430,
                developer: "Ashish",
                message: [
                    {
                        messageKey: "ALREADY_PAID_NOT_ALLOWED_TO_HALT",
                        category: "RECEIVING",
                        messageType: "Error",
                        messageCode: "RCV20259",
                        message: "You cannot Halt {0} already Paid.",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 1430:
            msgobj = {
                messageBuildNumber: 1431,
                developer: "Ashish",
                message: [
                    {
                        messageKey: "ALREADY_PAID_NOT_ALLOWED_TO_HALT",
                        category: "RECEIVING",
                        messageType: "Error",
                        messageCode: "RCV20259",
                        message: "{0} already paid, you cannot halt.",
                        modifiedDate: new Date(COMMON.getCurrentUTC()),
                        action: "U"
                    }
                ]
            };
            break;
        case 1431:
            msgobj = {
                messageBuildNumber: 1432,
                developer: "Ashish",
                message: [
                    {
                        messageKey: "NOT_ALLOWED_TO_PAY_HALTED_INVOICE",
                        category: "RECEIVING",
                        messageType: "Error",
                        messageCode: "RCV20261",
                        message: "From selected record(s) some of them are <b>Halted</b>. Please check selected record(s).",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 1432:
            msgobj = {
                messageBuildNumber: 1433,
                developer: "Charmi",
                message: [
                    {
                        messageCode: "RCV20258",
                        messageKey: "NOT_ALLOWED_INAUTO_BIN",
                        messageType: "Error",
                        message: "You cannot transfer UMID to smart card bin.",
                        category: "RECEIVING",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 1433:
            msgobj = {
                messageBuildNumber: 1434,
                developer: "Charmi",
                message: [
                    {
                        messageCode: "RCV20260",
                        messageKey: "NOT_ALLOW_DIFFRENT_DEPARTMENT_FOR_SPLITUMID",
                        messageType: "Error",
                        message: "Please select location/bin of <b>{0}</b>, as <b>{1}</b> is belongs to other parent warehouse i.e. <b>{2}</b>.",
                        category: "RECEIVING",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 1434:
            msgobj = {
                messageBuildNumber: 1435,
                developer: "Charmi",
                message: [
                    {
                        messageCode: "RCV50045",
                        messageKey: "SPLIT_UMID_CREATION",
                        messageType: "Error",
                        message: "UMID <b>{0}</b> created successfully. Press Continue will redirect to UMID detail.",
                        category: "RECEIVING",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 1435:
            msgobj = {
                messageBuildNumber: 1436,
                developer: "Charmi",
                message: [
                    {
                        messageCode: "RCV50045",
                        messageKey: "SPLIT_UMID_CREATION",
                        messageType: "Error",
                        message: "UMID <b>{0}</b> created successfully. Press Continue will redirect to UMID detail.",
                        category: "RECEIVING",
                        deletedDate: new Date(COMMON.getCurrentUTC()),
                        action: "D"
                    }
                ]
            };
            break;
        case 1436:
            msgobj = {
                messageBuildNumber: 1437,
                developer: "Charmi",
                message: [
                    {
                        messageCode: "RCV50045",
                        messageKey: "SPLIT_UMID_CREATION",
                        messageType: "Information",
                        message: "UMID <b>{0}</b> created successfully. Press Continue will redirect to UMID detail.",
                        category: "RECEIVING",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 1437:
            msgobj = {
                messageBuildNumber: 1438,
                developer: "Ashish",
                message: [
                    {
                        messageCode: "RCV20257",
                        messageKey: "SUPPLIER_TRANSACTION_DELETE_VALIDATION_FOR_LOCKED_TRANSACTIONS",
                        messageType: "Error",
                        category: "RECEIVING",
                        deletedDate: new Date(COMMON.getCurrentUTC()),
                        action: "D"
                    }
                ]
            };
            break;
        case 1438:
            msgobj = {
                messageBuildNumber: 1439,
                developer: "Ashish",
                message: [
                    {
                        messageKey: "SUPPLIER_TRANSACTION_DELETE_VALIDATION_FOR_LOCKED_HALT_TRANSACTIONS",
                        category: "RECEIVING",
                        messageType: "Error",
                        messageCode: "RCV20262",
                        message: "You can not delete selected record(s), as from selected record(s) some record(s) are <b>{0}</b>.",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 1439:
            msgobj = {
                messageBuildNumber: 1440,
                developer: "Charmi",
                message: [
                    {
                        messageCode: "RCV20263",
                        messageKey: "NOT_ALLOWED_CHANGE_INITIAL_QTY_HAVING_SAME_PACKINGSLIP",
                        messageType: "Error",
                        message: "Prior to change initial Count/Units, please check material receipt detail. Location/Bin <b>{0}</b> containing <b>{1} ({2}) </b> of packing slip <b>{3} [{4}]</b>.",
                        category: "RECEIVING",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 1440:
            msgobj = {
                messageBuildNumber: 1441,
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
        case 1441:
            msgobj = {
                messageBuildNumber: 1442,
                developer: "Shirish",
                message: [
                    {
                        messageCode: "RFQ40028",
                        messageKey: "SUBMIT_BOM_FOR_PRICING_CONFIRMATION_MSG",
                        messageType: "Confirmation",
                        message: "Quoted Internal version was same as BOM Current internal version.<br/>Press YES to update Part Costing and Labor Cost data and No to continue without update.",
                        category: "RFQ",
                        modifiedDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;

        case 1442:
            msgobj = {
                messageBuildNumber: 1443,
                developer: "Charmi",
                message: [
                    {
                        messageCode: "RCV40034",
                        messageKey: "UNPLANNED_QTY_KIT_RELEASE",
                        messageType: "Confirmation",
                        message: "You have unplanned kit qty. Are you sure you want to release kit for this plan?",
                        category: "RECEIVING",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 1443:
            msgobj = {
                messageBuildNumber: 1444,
                developer: "Charmi",
                message: [
                    {
                        messageCode: "RCV20264",
                        messageKey: "PLANKIT_QTY_VALIDATION",
                        messageType: "Error",
                        message: "Kit already released for Assy ID <b>{0}</b> with qty {1}. You can not change Kit Qty less than {1}.",
                        category: "RECEIVING",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;

        case 1444:
            msgobj = {
                messageBuildNumber: 1445,
                developer: "Charmi",
                message: [
                    {
                        messageCode: "RCV20265",
                        messageKey: "NOT_SCAN_OR_ENTER",
                        messageType: "Error",
                        message: "You have unplanned kit qty. Are you sure you want to release kit for this plan?",
                        category: "RECEIVING",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 1445:
            msgobj = {
                messageBuildNumber: 1446,
                developer: "Charmi",
                message: [
                    {
                        messageCode: "RCV20264",
                        messageKey: "APPROVED_TO_DEALLOCATE_FROM_KIT_WARNING",
                        messageType: "Warning",
                        message: "{0} is more than free to allocate quantity from UMID. So the system will be deallocated stock from below kits based on farthest promised shipped date.",
                        category: "RECEIVING",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "U"
                    }
                ]
            };
            break;
        case 1446:
            msgobj = {
                messageBuildNumber: 1447,
                developer: "Ketan",
                message: [
                    {
                        messageCode: "MFG20135",
                        messageKey: "INITIAL_STOCK_USED_NOT_ALLOW_DELETE",
                        messageType: "Error",
                        message: "You cannot delete initial stock for work order(s) <b>{0}</b>. It used either in <b>customer packing slip</b> or <b>UMID creation</b> or having <b>stock adjustment</b>.",
                        category: "MFG",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 1447:
            msgobj = {
                messageBuildNumber: 1448,
                developer: "Ketan",
                message: [
                    {
                        messageCode: "MFG20136",
                        messageKey: "INITIAL_STOCK_USED_NOT_ALLOW_TO_CHANGE_LESS",
                        messageType: "Error",
                        message: "Initial stock qty not allowed less than {0}. Qty used either in <b>customer packing slip</b> or <b>UMID creation</b> or having <b>stock adjustment</b>.",
                        category: "MFG",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 1448:
            msgobj = {
                messageBuildNumber: 1449,
                developer: "Ketan",
                message: [
                    {
                        messageCode: "MFG40044",
                        messageKey: "INITIAL_STOCK_WO_DATECODE_PO_CONFM",
                        messageType: "Confirmation",
                        message: "Current <b>Date Code Format/Date Code/PO#</b> is different from existing record(s) entry. Are you sure want to continue? Press yes to continue.",
                        category: "MFG",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 1449:
            msgobj = {
                messageBuildNumber: 1450,
                developer: "Charmi",
                message: [
                    {
                        messageCode: "RCV50045",
                        messageKey: "SPLIT_UMID_CREATION",
                        messageType: "Information",
                        message: "UMID <b>{0}</b> created successfully. Press Continue to redirect on UMID detail.",
                        category: "RECEIVING",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "U"
                    }
                ]
            };
            break;
        case 1450:
            msgobj = {
                messageBuildNumber: 1451,
                developer: "Charmi",
                message: [
                    {
                        messageCode: "RCV20090",
                        messageKey: "KIt_RELEASE_CHANGE_MRP_KIT_QTY_NOT_GRETER",
                        messageType: "Error",
                        message: "Total of <b>Promised Ship Qty From PO</b> or <b>Planned Kit & Planned Build Qty</b> is greater than <b>PO Qty</b> or <b>Kit Qty</b> respectively. <br />Please change <b>Promised Ship Qty From PO</b> or <b>Planned Kit & Planned Build Qty</b> from <b>Change Planning</b> pop-up.",
                        category: "RECEIVING",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "U"
                    }
                ]
            };
            break;
        case 1451:
            msgobj = {
                messageBuildNumber: 1452,
                developer: "Shweta",
                message: [
                    {
                        messageCode: "MFG20138",
                        messageKey: "CAN_NOT_ADD_SO_IN_WO",
                        messageType: "Error",
                        message: "You cannot \"Add\" selected SO#: <b> {0} </b>, Assigned PO Qty must be more than 0.",
                        category: "MFG",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 1452:
            msgobj = {
                messageBuildNumber: 1453,
                developer: "Ashish",
                message: [
                    {
                        messageKey: "LOCK_AND_HALT_VALIDATION_MESSAGE",
                        category: "RECEIVING",
                        messageType: "Error",
                        messageCode: "RCV20266",
                        message: "{0} {1} is {2}, so not allowed to {3}.",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 1453:
            msgobj = {
                messageBuildNumber: 1454,
                developer: "Ashish",
                message: [
                    {
                        messageKey: "HALT_VALIDATION_MESSAGE",
                        category: "RECEIVING",
                        messageType: "Error",
                        messageCode: "RCV20267",
                        message: "From selected record(s) some of them are <b>Locked</b>. Please check selected record(s).",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 1454:
            msgobj = {
                messageBuildNumber: 1455,
                developer: "Shweta",
                message: [
                    {
                        messageCode: "MFG40046",
                        messageKey: "SHIPPING_COMPONENT_WITHOUT_INVENTORY_CONFIRMATION",
                        messageType: "Confirmation",
                        message: "You are shipping Off-the-shelf Part  with \"Without Inventory\" option. Are you sure to Continue?",
                        category: "MFG",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 1455:
            msgobj = {
                messageBuildNumber: 1456,
                developer: "Shirish",
                message: [
                    {
                        messageCode: "RFQ50033",
                        messageKey: "PRICE_CANT_SELECT_DUE_TO_TBD",
                        messageType: "Information",
                        message: "Part price could not be selected due to part attribute set as TBD. Please update part attribute try again.",
                        category: "RFQ",
                        modifiedDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 1456:
            msgobj = {
                messageBuildNumber: 1457,
                developer: "Heena",
                message: [{
                    messageCode: "MFG10016",
                    messageKey: "CUST_APPLIED_CREDIT_MEMO_VOIDED_SUCCESS",
                    messageType: "Success",
                    message: "Customer Applied CM Voided Successfully.",
                    category: "MFG",
                    createdDate: new Date(COMMON.getCurrentUTC()),
                    action: "I"
                }]
            };
            break;
        case 1457:
            msgobj = {
                messageBuildNumber: 1458,
                developer: "Shirish",
                message: [
                    {
                        messageCode: "RFQ40029",
                        messageKey: "SUBMIT_BOM_FOR_PRICING_CONFIRMATION_MSG",
                        messageType: "Confirmation",
                        message: "Quoted internal version is same as current internal version.<br/>Press Yes to update Part & Labor costing, and, No to continue without update.",
                        category: "RFQ",
                        modifiedDate: new Date(COMMON.getCurrentUTC()),
                        action: "U"
                    }
                ]
            };
            break;
        case 1458:
            msgobj = {
                messageBuildNumber: 1459,
                developer: "Jay",
                message: [
                    {
                        messageKey: "PO_IS_ALREADY_CANCELED",
                        category: "RECEIVING",
                        messageType: "Warning",
                        messageCode: "RCV30022",
                        message: "PO# <b>{0}</b> is Canceled. {1}",
                        modifiedDate: new Date(COMMON.getCurrentUTC()),
                        action: "U"
                    }
                ]
            };
            break;
        case 1459:
            msgobj = {
                messageBuildNumber: 1460,
                developer: "Jay",
                message: [
                    {
                        messageKey: "PO_ALREADY_REVERTED",
                        category: "RECEIVING",
                        messageType: "Warning",
                        messageCode: "RCV30023",
                        message: "Cancellation is undone for PO# <b>{0}</b>. PO is not in canceled state. {1}",
                        modifiedDate: new Date(COMMON.getCurrentUTC()),
                        action: "U"
                    }
                ]
            };
            break;
        case 1460:
            msgobj = {
                messageBuildNumber: 1461,
                developer: "Jay",
                message: [
                    {
                        messageKey: "UNCHECK_CANCELLATION_CONFIRMED_BY_SUPPLIER",
                        category: "RECEIVING",
                        messageType: "Warning",
                        messageCode: "RCV30021",
                        message: "Prior to UNDO CANCELLATION please uncheck option <b>Cancellation Confirmed by Supplier</b>",
                        modifiedDate: new Date(COMMON.getCurrentUTC()),
                        action: "U"
                    }
                ]
            };
            break;
        case 1461:
            msgobj = {
                messageBuildNumber: 1462,
                developer: "Charmi",
                message: [
                    {
                        messageCode: "RCV20268",
                        messageKey: "REMOVE_UID_INTERNAL_VALIDATION",
                        messageType: "Error",
                        message: "Following combination of selected UMIDs conflicts delete condition as the system does not allow to place the same type of  material from different packing slips into one BIN.",
                        category: "RECEIVING",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 1462:
            msgobj = {
                messageBuildNumber: 1463,
                developer: "Charmi",
                message: [
                    {
                        messageCode: "RCV20269",
                        messageKey: "REMOVE_UID_WITH_PENDINGUID_VALIDATION",
                        messageType: "Error",
                        message: "System will not allow deletion of following UMID(s), as in from bin <b>{0}</b> stock available with same part <b>{1}</b> and packaging <b>{2}</b> of different packing slip.",
                        category: "RECEIVING",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 1463:
            msgobj = {
                messageBuildNumber: 1464,
                developer: "Jay",
                message: [
                    {
                        messageKey: "UNCHECK_CANCELLATION_CONFIRMED_BY_SUPPLIER",
                        category: "RECEIVING",
                        messageType: "Warning",
                        messageCode: "RCV30021",
                        message: "Prior to UNDO CANCELLATION, please uncheck option <b>Cancellation Confirmed by Supplier</b>",
                        modifiedDate: new Date(COMMON.getCurrentUTC()),
                        action: "U"
                    }
                ]
            };
            break;
        case 1464:
            msgobj = {
                messageBuildNumber: 1465,
                developer: "Jay",
                message: [
                    {
                        messageKey: "UNDO_CANCELLATION_CONFIRMATION",
                        category: "RECEIVING",
                        messageType: "Confirmation",
                        messageCode: "RCV40085",
                        message: "Are you sure you want to undo the cancellation of the PO# <b>{0}</b>?",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "U"
                    }
                ]
            };
            break;
        case 1465:
            msgobj = {
                messageBuildNumber: 1466,
                developer: "Shirish",
                message: [
                    {
                        messageCode: "RFQ40028",
                        messageKey: "SUBMIT_BOM_FOR_PRICING_CONFIRMATION_MSG",
                        messageType: "Confirmation",
                        message: "Quoted internal version is same as current internal version.<br/>Press Yes to update Part & Labor costing, and, No to continue without update.",
                        category: "RFQ",
                        modifiedDate: new Date(COMMON.getCurrentUTC()),
                        action: "U"
                    }
                ]
            };
            break;
        case 1466:
            msgobj = {
                messageBuildNumber: 1467,
                developer: "Shirish",
                message: [
                    {
                        messageCode: "RFQ40029",
                        messageKey: "VERIFY_BOM_PRICING_PART_CONFIRMATION_MSG",
                        messageType: "Confirmation",
                        message: "You have made some changes in BOM Line Item, which will impact in existing Part costing and Labor Cost details.<br/>Please resubmit the Part Costing & Labor Cost detail from the BOM Level tab to get update.",
                        category: "RFQ",
                        modifiedDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 1467:
            msgobj = {
                messageBuildNumber: 1468,
                developer: "Ashish",
                message: [
                    {
                        messageKey: "MARK_FOR_REFUND_VALIDATION_FOR_NOT_APPROVED_TO_PAY_STATUS",
                        category: "RECEIVING",
                        messageType: "Error",
                        messageCode: "RCV20270",
                        message: "<b>{0}</b> status is not <b>Approved to Pay</b>, so you can not mark for refund.",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 1468:
            msgobj = {
                messageBuildNumber: 1469,
                developer: "Ashish",
                message: [
                    {
                        messageKey: "REFUND_AMOUNT_SHOULD_NOT_GRATER_THAN_BALANCE_TO_PAY_AMOUNT",
                        category: "RECEIVING",
                        messageType: "Error",
                        messageCode: "RCV20272",
                        message: "Refund Amount ($) should not be greater than {0} Balance to Pay.",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 1469:
            msgobj = {
                messageBuildNumber: 1470,
                developer: "Ashish",
                message: [
                    {
                        messageKey: "REFUND_AMOUNT_SHOULD_NOT_GRATER_THAN_BALANCE_TO_PAY_AMOUNT",
                        category: "RECEIVING",
                        messageType: "Error",
                        messageCode: "RCV20272",
                        message: "Refund Amount ($) should not be greater than <b>{0}</b> Balance to Pay.",
                        modifiedDate: new Date(COMMON.getCurrentUTC()),
                        action: "U"
                    }
                ]
            };
            break;
        case 1470:
            msgobj = {
                messageBuildNumber: 1471,
                developer: "Shubham",
                message: [
                    {
                        messageKey: "ADD_TRANSACTION_CONFIRM_MESSAGE",
                        category: "MASTER",
                        messageType: "Confirmation",
                        messageCode: "MST40026",
                        message: "Selected <b>{0}</b> entity/entities will be added into enterprise search database. Press Yes to Continue.",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "U"
                    }
                ]
            };
            break;
        case 1471:
            msgobj = {
                messageBuildNumber: 1472,
                developer: "Shubham",
                message: [
                    {
                        messageKey: "ADD_TRANSACTION_WITH_DATE_RANGE_CONFIRM_MESSAGE",
                        category: "MASTER",
                        messageType: "Confirmation",
                        messageCode: "MST40035",
                        message: "Selected <b>{0}</b> entity/entities will be added into enterprise search database. Press Yes to Continue.",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 1472:
            msgobj = {
                messageBuildNumber: 1473,
                developer: "Charmi",
                message: [{
                    messageCode: "RCV20017",
                    messageKey: "MISMATCH_KIT_ALLOCATION_QTY_PLAN_KIT_QTY",
                    messageType: "Warning",
                    category: "RECEIVING",
                    deletedDate: new Date(COMMON.getCurrentUTC()),
                    action: "D"
                }]
            };
            break;
        case 1473:
            msgobj = {
                messageBuildNumber: 1474,
                developer: "Charmi",
                message: [{
                    messageCode: "RCV20109",
                    messageKey: "TOTAL_POQTY_POORDERQTYVALIDATION",
                    messageType: "Warning",
                    category: "RECEIVING",
                    deletedDate: new Date(COMMON.getCurrentUTC()),
                    action: "D"
                }]
            };
            break;
        case 1474:
            msgobj = {
                messageBuildNumber: 1475,
                developer: "Charmi",
                message: [{
                    messageCode: "RCV20108",
                    messageKey: "TOTAL_KITQTY_KITQTYVALIDATION",
                    messageType: "Error",
                    category: "RECEIVING",
                    deletedDate: new Date(COMMON.getCurrentUTC()),
                    action: "D"
                }]
            };
            break;
        case 1475:
            msgobj = {
                messageBuildNumber: 1476,
                developer: "Charmi",
                message: [{
                    messageCode: "RCV40034",
                    messageKey: "UNPLANNED_QTY_KIT_RELEASE",
                    messageType: "Confirmation",
                    category: "RECEIVING",
                    deletedDate: new Date(COMMON.getCurrentUTC()),
                    action: "D"
                }]
            };
            break;
        case 1476:
            msgobj = {
                messageBuildNumber: 1477,
                developer: "Charmi",
                message: [{
                    messageCode: "RCV20115",
                    messageKey: "KIt_RELEASE_CHANGE_MRP_KIT_QTY_NOT_GRETER_FOR_SUB_ASSY",
                    messageType: "Error",
                    category: "RECEIVING",
                    deletedDate: new Date(COMMON.getCurrentUTC()),
                    action: "D"
                }]
            };
            break;
        case 1477:
            msgobj = {
                messageBuildNumber: 1478,
                developer: "Charmi",
                message: [{
                    messageCode: "RCV20090",
                    messageKey: "KIt_RELEASE_CHANGE_MRP_KIT_QTY_NOT_GRETER",
                    messageType: "Error",
                    category: "RECEIVING",
                    deletedDate: new Date(COMMON.getCurrentUTC()),
                    action: "D"
                }]
            };
            break;
        case 1478:
            msgobj = {
                messageBuildNumber: 1479,
                developer: "Charmi",
                message: [
                    {
                        messageCode: "RCV20271",
                        messageKey: "TBD_POKITQTY_VALIDATION",
                        messageType: "Error",
                        message: "In prior to kit planning, TBD of PO/Kit Qty must be 0 or both are greater than 0.",
                        category: "RECEIVING",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 1479:
            msgobj = {
                messageBuildNumber: 1480,
                developer: "Shubham",
                message: [
                    {
                        messageKey: "ADD_TRANSACTION_WITH_DATE_RANGE_CONFIRM_MESSAGE",
                        category: "MASTER",
                        messageType: "Confirmation",
                        messageCode: "MST40035",
                        message: "Selected <b>{0}</b> entity/entities will be added into enterprise search database for selected date range <b>from {1} to {2}</b>.<br />Press Yes to Continue.",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "U"
                    }
                ]
            };
            break;
        case 1480:
            msgobj = {
                messageBuildNumber: 1481,
                developer: "Shweta",
                message: [
                    {
                        messageKey: "ADD_INACTIVE_PART_CONFIRMATION",
                        category: "GLOBAL",
                        messageType: "Confirmation",
                        messageCode: "GLB40044",
                        message: "Part is Inactive (Internal)'. Are you still want to continue?",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 1481:
            msgobj = {
                messageBuildNumber: 1482,
                developer: "Ketan",
                message: [
                    {
                        messageKey: "WRITE_OFF_FROM_CUST_PAYMENT_CONFIRMATION",
                        category: "MFG",
                        messageType: "Confirmation",
                        messageCode: "MFG40048",
                        message: "You have selected <b>Write off the extra amount</b> option. Total <b>${0}</b> will be added as Write off amount. Are you sure want to Continue?",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 1482:
            msgobj = {
                messageBuildNumber: 1483,
                developer: "Ketan",
                message: [
                    {
                        messageKey: "WRITE_OFF_CUST_TRANSACTION_CONFIRMATION",
                        category: "MFG",
                        messageType: "Confirmation",
                        messageCode: "MFG40049",
                        message: "You are doing <b>Write Off transaction</b>. Total <b>${0}</b> will be added as Write off amount. Are you sure want to Continue?",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 1483:
            msgobj = {
                messageBuildNumber: 1484,
                developer: "Ketan",
                message: [
                    {
                        messageKey: "CUST_INV_PAY_WRITE_OFF_APPLIED_SUCCESS",
                        category: "MFG",
                        messageType: "Success",
                        messageCode: "MFG10017",
                        message: "Customer write off applied successfully.",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 1484:
            msgobj = {
                messageBuildNumber: 1485,
                developer: "Ketan",
                message: [
                    {
                        messageKey: "WRITE_OFF_FROM_CUST_PAYMENT_CONFIRMATION",
                        category: "MFG",
                        messageType: "Confirmation",
                        messageCode: "MFG40048",
                        message: "You have selected <b>Write off the extra amount</b> option. Total <b>${0}</b> will be added as Write Off amount. Are you sure want to Continue?",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "U"
                    }
                ]
            };
            break;
        case 1485:
            msgobj = {
                messageBuildNumber: 1486,
                developer: "Jay",
                message: [
                    {
                        messageKey: "PO_CONTAINST_INACTIVE_PART",
                        category: "RECEIVING",
                        messageType: "Confirmation",
                        messageCode: "RCV40088",
                        message: "Inactive (Internal) parts will not be duplicated in new PO. Are you sure you want to duplicate <b>PO {0}</b>?",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 1486:
            msgobj = {
                messageBuildNumber: 1487,
                developer: "Jay",
                message: [
                    {
                        messageKey: "PART_IN_INTERNAL_INACTIVE",
                        category: "RECEIVING",
                        messageType: "Warning",
                        messageCode: "RCV30024",
                        message: "Removing the 'Cancellation Confirmed by Supplier' is restricted as the Part Status of <b>MPN {0} </b> is 'Inactive (Internal)'. Please update the Part Status from 'Inactive (Internal)' to other Status and continue",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 1487:
            msgobj = {
                messageBuildNumber: 1488,
                developer: "Ketan",
                message: [
                    {
                        messageCode: "MFG20118",
                        messageKey: "CUST_PAYMENT_ALREADY_VOIDED",
                        messageType: "Error",
                        message: "<b>{0}</b> {2} already <b>voided</b>. Please check {1}.",
                        category: "MFG",
                        modifiedDate: new Date(COMMON.getCurrentUTC()),
                        action: "U"
                    }
                ]
            };
            break;
        case 1488:
            msgobj = {
                messageBuildNumber: 1489,
                developer: "Ketan",
                message: [
                    {
                        messageKey: "ANY_TYPE_VOID_SUCCESS",
                        category: "GLOBAL",
                        messageType: "Success",
                        messageCode: "GLB10021",
                        message: "{0} voided successfully.",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 1489:
            msgobj = {
                messageBuildNumber: 1490,
                developer: "Ashish",
                message: [
                    {
                        messageKey: "DUPLICATE_SUPPLIER_REFUND_NUMBER",
                        category: "RECEIVING",
                        messageType: "Error",
                        messageCode: "RCV20274",
                        message: "Payment or Check Number already exists for same supplier.",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 1490:
            msgobj = {
                messageBuildNumber: 1491,
                developer: "Ashish",
                message: [
                    {
                        messageKey: "SUPPLIER_REFUND_NOT_SAVED",
                        category: "RECEIVING",
                        messageType: "Error",
                        messageCode: "RCV20275",
                        message: "Supplier Refund was unsuccessful.",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 1491:
            msgobj = {
                messageBuildNumber: 1492,
                developer: "Ashish",
                message: [
                    {
                        messageKey: "SUPPLIER_REFUND_SAVED_SUCCESSFULLY",
                        category: "RECEIVING",
                        messageType: "Success",
                        messageCode: "RCV10009",
                        message: "Supplier Refund saved successfully.",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 1492:
            msgobj = {
                messageBuildNumber: 1493,
                developer: "Ashish",
                message: [
                    {
                        messageKey: "SUPPLIER_REFUND_HAS_VARIANCE_SO_CAN_NOT_SAVE",
                        category: "RECEIVING",
                        messageType: "Error",
                        messageCode: "RCV20276",
                        message: "Refund transaction has variance, You can not save.",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 1493:
            msgobj = {
                messageBuildNumber: 1494,
                developer: "Vaibhav",
                message: [
                    {
                        messageKey: "MAPPING_SERIAL_NO_NOT_ALLOW",
                        category: "MFG",
                        messageType: "Error",
                        messageCode: "MFG20141",
                        message: "Serial# mapping not allowed, Please configure allow mapping for operation.",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "U"
                    }
                ]
            };
            break;
        case 1494:
            msgobj = {
                messageBuildNumber: 1495,
                developer: "Vaibhav",
                message: [
                    {
                        messageKey: "INVALID_LOOP_OPERATION",
                        category: "MFG",
                        messageType: "Error",
                        messageCode: "MFG20142",
                        message: "First operation cannot be loop operation.",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "U"
                    }
                ]
            };
            break;
        case 1495:
            msgobj = {
                messageBuildNumber: 1496,
                developer: "Shweta",
                message: [
                    {
                        messageKey: "ADD_INACTIVE_PART_CONFIRMATION",
                        category: "GLOBAL",
                        messageType: "Confirmation",
                        messageCode: "GLB40044",
                        message: "Part {0} is Inactive (Internal). Are you still want to continue?",
                        modifiedDate: new Date(COMMON.getCurrentUTC()),
                        action: "U"
                    }
                ]
            };
            break;
        case 1496:
            msgobj = {
                messageBuildNumber: 1497,
                developer: "SHUBHAM",
                message: [
                    {
                        messageKey: "DUPLICATE_SUPPLIER_QUOTE_WITH_INACTIVE_PART",
                        category: "RECEIVING",
                        messageType: "Error",
                        messageCode: "RCV20273",
                        message: "Selected part <b>{0}</b> is Inactive(Internal), so you cannot copy this supplier quote <b>#{1}</b>.",
                        modifiedDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 1497:
            msgobj = {
                messageBuildNumber: 1498,
                developer: "Ketan",
                message: [
                    {
                        messageKey: "WRITE_OFF_CUST_TRANSACTION_CONFIRMATION",
                        category: "MFG",
                        messageType: "Confirmation",
                        messageCode: "MFG40049",
                        message: "You are doing <b>Write off transaction</b>. Total <b>${0}</b> will be added as Write Off amount. Are you sure want to Continue?",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "U"
                    }
                ]
            };
            break;
        case 1498:
            msgobj = {
                messageBuildNumber: 1499,
                developer: "Charmi",
                message: [
                    {
                        messageCode: "RCV40086",
                        messageKey: "MAINTAIN_CURRENT_KIT_PLANNING",
                        messageType: "Confirmation",
                        message: "This will re-release current kit plan <b>#{0}</b>. Subsequent kit plan status will change kit released status from Released to Not Released for plan(s) <b>#{1}</b>. Are you sure you want to continue?",
                        category: "RECEIVING",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 1499:
            msgobj = {
                messageBuildNumber: 1500,
                developer: "Charmi",
                message: [
                    {
                        messageCode: "RCV40087",
                        messageKey: "CHANGE_CURRENT_KIT_PLANNING",
                        messageType: "Confirmation",
                        message: "This will change all kit released status from Released to Not Released for plan(s) <b>#{0}</b>. Are you sure you want to continue?",
                        category: "RECEIVING",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 1500:
            msgobj = {
                messageBuildNumber: 1501,
                developer: "Charmi",
                message: [
                    {
                        messageCode: "RCV20161",
                        messageKey: "KIT_RETURN_WO_STATUS_CHANGE",
                        messageType: "Error",
                        message: "To return request for WO# <b>{0}</b>. The workorder status must be either <b>Completed, Terminated, Completed With Missing Parts or Void.</b>",
                        category: "RECEIVING",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "U"
                    }
                ]
            };
            break;
        case 1501:
            msgobj = {
                messageBuildNumber: 1502,
                developer: "Charmi",
                message: [
                    {
                        messageCode: "RCV40033",
                        messageKey: "RERELEASE_KIT",
                        messageType: "Confirmation",
                        message: "This is non-allocated work order returned plan. You are trying to re-release the selected Release plan# {0}, so please select applicable option from following.",
                        category: "RECEIVING",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "U"
                    }
                ]
            };
            break;
        case 1502:
            msgobj = {
                messageBuildNumber: 1503,
                developer: "Charmi",
                message: [
                    {
                        messageCode: "RCV20068",
                        messageKey: "NOT_IN_CPN",
                        messageType: "Error",
                        message: "Selected MPN is not mapped in CPN.",
                        category: "RECEIVING",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "U"
                    }
                ]
            };
            break;
        case 1503:
            msgobj = {
                messageBuildNumber: 1504,
                developer: "Jay",
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
        case 1504:
            msgobj = {
                messageBuildNumber: 1505,
                developer: "Jay",
                message: [
                    {
                        messageCode: "RCV40064",
                        messageKey: "PO_STATUS_REVISION_CHANGE_CONFIRMATION",
                        messageType: "Confirmation",
                        message: "Purchase Order updated with <b>Published</b> status.<br />Do you want to upgrade the <b>PO Revision</b> from <b>{0} to {1}</b>?",
                        category: "RECEIVING",
                        modifiedDate: new Date(COMMON.getCurrentUTC()),
                        action: "U"
                    }
                ]
            };
            break;
        case 1505:
            msgobj = {
                messageBuildNumber: 1506,
                developer: "Ashish",
                message: [
                    {
                        messageKey: "SUPPLIER_CM_DM_NOT_MAKRED_FOR_REFUND",
                        category: "RECEIVING",
                        messageType: "Error",
                        messageCode: "RCV20277",
                        message: "From selected record(s) some of them are not <b>marked for refund</b>. Please check the selected record(s).",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 1506:
            msgobj = {
                messageBuildNumber: 1507,
                developer: "Jay",
                message: [
                    {
                        messageKey: "PO_IS_COMPLETED",
                        category: "RECEIVING",
                        messageType: "Error",
                        messageCode: "RCV20278",
                        message: "You can not create the Packing Slip for PO# <b>{0}</b>. Because the PO Working status is <b>Completed</b>.",
                        modifiedDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 1507:
            msgobj = {
                messageBuildNumber: 1508,
                developer: "Jay",
                message: [
                    {
                        messageKey: "PO_LINE_STATUS_IS_CLOSED",
                        category: "RECEIVING",
                        messageType: "Error",
                        messageCode: "RCV20279",
                        message: "You can not add the Part <b>{0}</b>. Because in the PO <b>{1}</b> the PO Line working status of this part is <b>CLOSED</b>",
                        modifiedDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 1508:
            msgobj = {
                messageBuildNumber: 1509,
                developer: "Ashish",
                message: [
                    {
                        messageKey: "SUPPLIER_PAYMENT_VOIDED",
                        category: "RECEIVING",
                        messageType: "Information",
                        messageCode: "RCV50035",
                        message: "Supplier Invoice {0} Voided successfully.",
                        modifiedDate: new Date(COMMON.getCurrentUTC()),
                        action: "U"
                    }
                ]
            };
            break;
        case 1509:
            msgobj = {
                messageBuildNumber: 1510,
                developer: "Ketan",
                message: [
                    {
                        messageCode: "MFG50058",
                        messageKey: "CUST_PAY_INV_ITEM_MAX_ALLOWED_AMT_INFO",
                        messageType: "Information",
                        message: "Invalid <b>${0}</b> amount. You cannot enter amount more than <b>${1}</b>.",
                        category: "MFG",
                        modifiedDate: new Date(COMMON.getCurrentUTC()),
                        action: "U"
                    }
                ]
            };
            break;
        case 1510:
            msgobj = {
                messageBuildNumber: 1511,
                developer: "Ketan",
                message: [
                    {
                        messageKey: "CUST_INV_PAY_WRITE_OFF_APPLIED_SUCCESS",
                        category: "MFG",
                        messageType: "Success",
                        messageCode: "MFG10017",
                        message: "Write Off applied successfully.",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "U"
                    }
                ]
            };
            break;
        case 1511:
            msgobj = {
                messageBuildNumber: 1512,
                developer: "Ketan",
                message: [
                    {
                        messageKey: "WRITE_OFF_CUST_TRANSACTION_CONFIRMATION",
                        category: "MFG",
                        messageType: "Confirmation",
                        messageCode: "MFG40049",
                        message: "<b>${0}</b> will be written off for selected invoice and will be added to <b>total write off amount</b>. Are you sure want to Continue?",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "U"
                    }
                ]
            };
            break;
        case 1512:
            msgobj = {
                messageBuildNumber: 1513,
                developer: "Ketan",
                message: [
                    {
                        messageKey: "WRITE_OFF_FROM_CUST_PAYMENT_CONFIRMATION",
                        category: "MFG",
                        messageType: "Confirmation",
                        messageCode: "MFG40048",
                        message: "You have selected option to <b>Write off the extra amount</b>. Total <b>${0}</b> will be written off. Are you sure want to Continue?",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "U"
                    }
                ]
            };
            break;
        case 1513:
            msgobj = {
                messageBuildNumber: 1514,
                developer: "Jay",
                message: [
                    {
                        messageKey: "PO_LINE_STATUS_IS_CLOSED",
                        category: "RECEIVING",
                        messageType: "Error",
                        messageCode: "RCV20279",
                        message: "You can not add the Part# <b>{0}</b>. Because in the PO# <b>{1}</b> the PO Line working status of this part is <b>CLOSED</b>",
                        modifiedDate: new Date(COMMON.getCurrentUTC()),
                        action: "U"
                    }
                ]
            };
            break;
        case 1514:
            msgobj = {
                messageBuildNumber: 1515,
                developer: "Jay",
                message: [
                    {
                        messageKey: "PO_ALREADY_CANCELED",
                        category: "RECEIVING",
                        messageType: "Confirmation",
                        messageCode: "RCV40084",
                        message: "PO# <b>{0}</b> is already <b>CANCELED</b> and parts from the canceled PO will be received as a <b>Rejected Parts</b>.<br />Are you sure you want to proceed further to create Material Receipt?",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "U"
                    }
                ]
            };
            break;
        case 1515:
            msgobj = {
                messageBuildNumber: 1516,
                developer: "Jay",
                message: [
                    {
                        messageKey: "PART_IN_INTERNAL_INACTIVE",
                        category: "RECEIVING",
                        messageType: "Warning",
                        messageCode: "RCV30024",
                        message: "Removing the <b>'Cancellation Confirmed by Supplier'</b> is restricted as the Part Status of <b>MPN {0} </b> is <b>'Inactive (Internal)'</b>.<br />Please update the Part Status from <b>'Inactive (Internal)'</b> to other Status and continue",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "U"
                    }
                ]
            };
            break;
        case 1516:
            msgobj = {
                messageBuildNumber: 1517,
                developer: "Charmi",
                message: [
                    {
                        messageCode: "RCV40019",
                        messageKey: "DEALLOCATE_CONFIRMATION",
                        messageType: "Confirmation",
                        message: "Are you sure you want to deallocate selected UMID(s) from this kit? Press Yes to Continue.",
                        category: "RECEIVING",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "U"
                    }
                ]
            };
            break;
        case 1517:
            msgobj = {
                messageBuildNumber: 1518,
                developer: "Charmi",
                message: [
                    {
                        messageCode: "RCV20001",
                        messageKey: "NOT_ALLOW_RETURN_KIT_FOR_ALLOCATED_UMID",
                        messageType: "Error",
                        message: "Prior to <b>Return Kit</b> please consume/deallocate the inventory from the kit.<br/>Following <b>UMID(s)</b> are allocated to this kit.<br/><b>{0}</b>",
                        category: "RECEIVING",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "U"
                    }
                ]
            };
            break;
        case 1518:
            msgobj = {
                messageBuildNumber: 1519,
                developer: "Shirish",
                message: [
                    {
                        messageCode: "RFQ50034",
                        messageKey: "AVL_CUSTOME_PART_REV_SHOULD_SAME",
                        messageType: "Information",
                        message: "You are adding <b>AVL part</b> with different <b>Revision</b>, all <b>AVL parts</b> must have same <b>Revision</b>. <br />Please check once.",
                        category: "RFQ",
                        modifiedDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 1519:
            msgobj = {
                messageBuildNumber: 1520,
                developer: "Shirish",
                message: [
                    {
                        messageCode: "RFQ40030",
                        messageKey: "UMID_STOCK_CONFIRMATION_ON_CPN_MAPPING_REMOVE",
                        messageType: "Confirmation",
                        message: "UMID Stock Available for Following Parts. Are you sure want to remove MPN Mapping from CPN.",
                        category: "RFQ",
                        modifiedDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 1520:
            msgobj = {
                messageBuildNumber: 1521,
                developer: "Jay",
                message: [
                    {
                        messageKey: "PO_CONTAINST_INACTIVE_PART",
                        category: "RECEIVING",
                        messageType: "Confirmation",
                        messageCode: "RCV40088",
                        message: "<b>Inactive (Internal)</b> parts will not be duplicated in new PO. Are you sure you want to duplicate <b>PO# {0}</b>?",
                        modifiedDate: new Date(COMMON.getCurrentUTC()),
                        action: "U"
                    }
                ]
            };
            break;
        case 1521:
            msgobj = {
                messageBuildNumber: 1522,
                developer: "Jay",
                message: [
                    {
                        messageKey: "PART_DO_NOT_EXIST_IN_PO_LINE",
                        category: "RECEIVING",
                        messageType: "Confirmation",
                        messageCode: "RCV40081",
                        message: "You are adding the part <b>{0}</b> in this packing slip which is not ordered in the associated <b>PO# {1}</b>. Would you like to receive this part as a <b>Received Wrong Part</b>?",
                        modifiedDate: new Date(COMMON.getCurrentUTC()),
                        action: "U"
                    }
                ]
            };
            break;
        case 1522:
            msgobj = {
                messageBuildNumber: 1523,
                developer: "Jay",
                message: [
                    {
                        messageKey: "WRONG_PART_IS_UNCHECKED",
                        category: "RECEIVING",
                        messageType: "Error",
                        messageCode: "RCV20254",
                        message: "The part <b>{0}</b> does not exists in <b>PO# {1}</b>. Please select checkbox <b>Received Wrong Part</b> to continue.",
                        modifiedDate: new Date(COMMON.getCurrentUTC()),
                        action: "U"
                    }
                ]
            };
            break;
        case 1523:
            msgobj = {
                messageBuildNumber: 1524,
                developer: "Jay",
                message: [
                    {
                        messageKey: "PO_ALREADY_CANCELED",
                        category: "RECEIVING",
                        messageType: "Confirmation",
                        messageCode: "RCV40084",
                        message: "<b>PO# {0}</b> is already <b>CANCELED</b> and parts from the canceled PO will be received as a <b>Rejected Parts</b>.<br />Are you sure you want to proceed further to create Material Receipt?",
                        modifiedDate: new Date(COMMON.getCurrentUTC()),
                        action: "U"
                    }
                ]
            };
            break;
        case 1524:
            msgobj = {
                messageBuildNumber: 1525,
                developer: "Jay",
                message: [
                    {
                        messageKey: "PART_IN_INTERNAL_INACTIVE",
                        category: "RECEIVING",
                        messageType: "warning",
                        messageCode: "RCV30024",
                        message: "Removing the <b>Cancellation Confirmed by Supplier</b> is restricted as the Part Status of part <b>{0}</b> is <b>Inactive (Internal)</b>.<br />Please update the Part Status from <b>Inactive (Internal)</b> to other Status and continue.",
                        modifiedDate: new Date(COMMON.getCurrentUTC()),
                        action: "U"
                    }
                ]
            };
            break;
        case 1525:
            msgobj = {
                messageBuildNumber: 1526,
                developer: "Jay",
                message: [
                    {
                        messageKey: "PART_ALREADY_CLOSE_FROM_PO",
                        category: "RECEIVING",
                        messageType: "Error",
                        messageCode: "RCV30024",
                        message: "You can not receive Part <b>{0}</b>, as release# <b>{1}</b> already <b>CLOSED</b> for PO line# <b>{2}</b> of <b>PO# {3}</b>.",
                        modifiedDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 1526:
            msgobj = {
                messageBuildNumber: 1527,
                developer: "Ashish",
                message: [
                    {
                        messageKey: "SUPPLIER_REFUND_ALREADY_VOIDED",
                        category: "RECEIVING",
                        messageType: "Error",
                        messageCode: "RCV20280",
                        message: "Supplier Refund already voided. Please check.",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 1527:
            msgobj = {
                messageBuildNumber: 1528,
                developer: "Jay",
                message: [
                    {
                        messageKey: "PART_ALREADY_INACTIVE",
                        category: "RECEIVING",
                        messageType: "Error",
                        messageCode: "RCV20282",
                        message: "For part(s) <b>{0}</b>, part status is <b>Inactive(Internal)</b>. So it is restricted to add in the PO# <b>{1}</b>.<br />To proceed the transaction either you have to change part status from part master or remove that part from PO and then continue with PO.",
                        modifiedDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 1528:
            msgobj = {
                messageBuildNumber: 1529,
                developer: "Jay",
                message: [
                    {
                        messageKey: "PART_IN_INTERNAL_INACTIVE",
                        category: "RECEIVING",
                        messageType: "warning",
                        messageCode: "RCV30024",
                        message: "Removing the <b>Cancellation Confirmed by Supplier</b> is restricted as the Part Status of part <b>{0}</b> is <b>Inactive (Internal)</b>.<br />Please update the Part Status from <b>Inactive (Internal)</b> to other Status and continue.",
                        modifiedDate: new Date(COMMON.getCurrentUTC()),
                        action: "U"
                    }
                ]
            };
            break;
        case 1529:
            msgobj = {
                messageBuildNumber: 1530,
                developer: "Jay",
                message: [
                    {
                        messageKey: "PART_ALREADY_CLOSE_FROM_PO",
                        category: "RECEIVING",
                        messageType: "Error",
                        messageCode: "RCV30024",
                        message: "You can not receive Part <b>{0}</b>, as release# <b>{1}</b> already <b>CLOSED</b> for PO line# <b>{2}</b> of <b>PO# {3}</b>.",
                        modifiedDate: new Date(COMMON.getCurrentUTC()),
                        action: "D"
                    }
                ]
            };
            break;
        case 1530:
            msgobj = {
                messageBuildNumber: 1531,
                developer: "Jay",
                message: [
                    {
                        messageKey: "PART_ALREADY_CLOSE_FROM_PO",
                        category: "RECEIVING",
                        messageType: "Error",
                        messageCode: "RCV20281",
                        message: "You can not receive Part <b>{0}</b>, as release# <b>{1}</b> already <b>CLOSED</b> for PO line# <b>{2}</b> of <b>PO# {3}</b>.",
                        modifiedDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 1531:
            msgobj = {
                messageBuildNumber: 1532,
                developer: "Shweta",
                message: [
                    {
                        messageCode: "MFG40010",
                        messageKey: "CP_STATUS_CHANGE",
                        messageType: "Confirmation",
                        message: "Customer Packing Slip status will be changed from <b>{0}</b> to <b>{1}</b>, Press Yes to Continue.",
                        category: "MFG",
                        modifiedDate: new Date(COMMON.getCurrentUTC()),
                        action: "U"
                    }
                ]
            };
            break;
        case 1532:
            msgobj = {
                messageBuildNumber: 1533,
                developer: "Shweta",
                message: [
                    {
                        messageKey: "PUBLISHED_TRANS_UPDATE_REVISION_CONFIRMATION",
                        category: "GLOBAL",
                        messageType: "Confirmation",
                        messageCode: "GLB40040",
                        message: "Changes are made, Do you want to upgrade {0} version from <b>{1}</b> to <b>{2}</b>?",
                        modifiedDate: new Date(COMMON.getCurrentUTC()),
                        action: "U"
                    }
                ]
            };
            break;
        case 1533:
            msgobj = {
                messageBuildNumber: 1534,
                developer: "Shweta",
                message: [
                    {
                        messageKey: "ADD_INACTIVE_PART_CONFIRMATION",
                        category: "GLOBAL",
                        messageType: "Confirmation",
                        messageCode: "GLB40044",
                        message: "Part <b>{0}</b> is <b>Inactive (Internal)</b>. Are you still want to continue?",
                        modifiedDate: new Date(COMMON.getCurrentUTC()),
                        action: "U"
                    }
                ]
            };
            break;
        case 1534:
            msgobj = {
                messageBuildNumber: 1535,
                developer: "Shweta",
                message: [
                    {
                        messageCode: "GLB20025",
                        messageKey: "PREFIX_OR_SUFFIX_REQUIRED_MESSAGE",
                        messageType: "Error",
                        message: "Please enter at least one value either Prefix or Suffix, or else enter both.",
                        category: "GLOBAL",
                        modifiedDate: new Date(COMMON.getCurrentUTC()),
                        action: "U"
                    }
                ]
            };
            break;
        case 1535:
            msgobj = {
                messageBuildNumber: 1536,
                developer: "Shweta",
                message: [
                    {
                        messageCode: 'MFG20085',
                        messageKey: 'SERIAL_NO_DELETION_ERROR',
                        messageType: 'Error',
                        message: 'Serial# cannot be deleted due to any of the following reason(s): <br/> 1. Only <b>last Serial#</b> is allowed to delete for selected <b>{0}</b>.<br/>2. Selected <b>Serial#(s)</b> already scanned in production activity.',
                        category: 'MFG',
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: 'U'
                    }
                ]
            };
            break;
        case 1536:
            msgobj = {
                messageBuildNumber: 1537,
                developer: "Jay",
                message: [
                    {
                        messageKey: "PART_ALREADY_CLOSE_FROM_PO",
                        category: "RECEIVING",
                        messageType: "Error",
                        messageCode: "RCV20281",
                        message: "You can not receive Part <b>{0}</b>, as PO release# <b>{1}</b> already <b>CLOSED</b> for PO line# <b>{2}</b> of <b>PO# {3}</b>.",
                        modifiedDate: new Date(COMMON.getCurrentUTC()),
                        action: "U"
                    }
                ]
            };
            break;
        case 1537:
            msgobj = {
                messageBuildNumber: 1538,
                developer: "Charmi",
                message: [
                    {
                        messageCode: "RCV20283",
                        messageKey: "NOT_ALLOWED_CHANGE_INITIAL_QTY_FOR_SPLIT_UMID",
                        messageType: "Error",
                        message: "Scanned UMID <b>{0}</b> is split UMID, so you are not allowed to change initial qty.",
                        category: "RECEIVING",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 1538:
            msgobj = {
                messageBuildNumber: 1539,
                developer: "Heena",
                message: [
                    {
                        messageKey: "PAY_AMT_NOT_MORE_THAN_AGREEED_REF_AMT ",
                        category: "MFG",
                        messageType: "Error",
                        messageCode: "MFG20143",
                        message: "<b>Refund Amount of the selected {0}(s)</b> must be less than or equal to <b>Remaning Agreed Refund Amount ($){1}</b>. Please update Refund AMT.",
                        modifiedDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 1539:
            msgobj = {
                messageBuildNumber: 1540,
                developer: "Heena",
                message: [
                    {
                        messageKey: "CUST_REFUND_DET_CHANGED_TRY_AGAIN ",
                        category: "MFG",
                        messageType: "Error",
                        messageCode: "MFG20144",
                        message: "Refund details already changed. Please refresh {0} details.",
                        modifiedDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 1540:
            msgobj = {
                messageBuildNumber: 1541,
                developer: "Heena",
                message: [
                    {
                        messageKey: "CUST_REFUND_WITH_DUPLICATE_PAY_CHECK_NO_CONFM ",
                        category: "MFG",
                        messageType: "Confirmation",
                        messageCode: "MFG40050",
                        message: "Refund already received with <b>{0}</b> payment# or check#. You want to receive Refund with same <b>{0}</b> payment# or check#?",
                        modifiedDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 1541:
            msgobj = {
                messageBuildNumber: 1542,
                developer: "Heena",
                message: [
                    {
                        messageKey: "PAYMENT_ALREADY_APPLIED_IN_CUST_REFUND ",
                        category: "MFG",
                        messageType: "Error",
                        messageCode: "MFG20145",
                        message: "Payment <b>{0}</b> already selected and applied in refund.",
                        modifiedDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 1542:
            msgobj = {
                messageBuildNumber: 1543,
                developer: "Heena",
                message: [
                    {
                        messageKey: "CM_ALREADY_APPLIED_IN_CUST_REFUND ",
                        category: "MFG",
                        messageType: "Error",
                        messageCode: "MFG20146",
                        message: "Crrdit Memo <b>{0}</b> already selected and applied in refund.",
                        modifiedDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 1543:
            msgobj = {
                messageBuildNumber: 1544,
                developer: "Heena",
                message: [
                    {
                        messageKey: "AGREED_AMT_LESS_REMAINING",
                        category: "GLOBAL",
                        messageType: "Error",
                        messageCode: "GLB20063",
                        message: "Agreed Amount should not be more then Remaining Amount.",
                        modifiedDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 1544:
            msgobj = {
                messageBuildNumber: 1545,
                developer: "Shirish",
                message: [
                    {
                        messageCode: "RFQ40030",
                        messageKey: "UMID_STOCK_CONFIRMATION_ON_CPN_MAPPING_REMOVE",
                        messageType: "Confirmation",
                        message: "CPN stock exists in the system. Are you sure you want to remove part from CPN?",
                        category: "RFQ",
                        modifiedDate: new Date(COMMON.getCurrentUTC()),
                        action: "U"
                    }
                ]
            };
            break;
        case 1545:
            msgobj = {
                messageBuildNumber: 1546,
                developer: "Heena",
                message: [
                    {
                        messageKey: "PAY_AMT_NOT_MORE_THAN_AGREEED_REF_AMT ",
                        category: "MFG",
                        messageType: "Error",
                        messageCode: "MFG20143",
                        message: "<b>Refund Amount of the selected {0}(s)</b> must be less than or equal to <b>Remaning Agreed Refund Amount ($){1}</b>. Please update Refund AMT.",
                        modifiedDate: new Date(COMMON.getCurrentUTC()),
                        action: "D"
                    }
                ]
            };
            break;
        case 1546:
            msgobj = {
                messageBuildNumber: 1547,
                developer: "Heena",
                message: [
                    {
                        messageKey: "CUST_REFUND_DET_CHANGED_TRY_AGAIN ",
                        category: "MFG",
                        messageType: "Error",
                        messageCode: "MFG20144",
                        message: "Refund details already changed. Please refresh {0} details.",
                        modifiedDate: new Date(COMMON.getCurrentUTC()),
                        action: "D"
                    }
                ]
            };
            break;
        case 1547:
            msgobj = {
                messageBuildNumber: 1548,
                developer: "Heena",
                message: [
                    {
                        messageKey: "CUST_REFUND_WITH_DUPLICATE_PAY_CHECK_NO_CONFM ",
                        category: "MFG",
                        messageType: "Confirmation",
                        messageCode: "MFG40050",
                        message: "Refund already received with <b>{0}</b> payment# or check#. You want to receive Refund with same <b>{0}</b> payment# or check#?",
                        modifiedDate: new Date(COMMON.getCurrentUTC()),
                        action: "D"
                    }
                ]
            };
            break;
        case 1548:
            msgobj = {
                messageBuildNumber: 1549,
                developer: "Heena",
                message: [
                    {
                        messageKey: "PAYMENT_ALREADY_APPLIED_IN_CUST_REFUND ",
                        category: "MFG",
                        messageType: "Error",
                        messageCode: "MFG20145",
                        message: "Payment <b>{0}</b> already selected and applied in refund.",
                        modifiedDate: new Date(COMMON.getCurrentUTC()),
                        action: "D"
                    }
                ]
            };
            break;
        case 1549:
            msgobj = {
                messageBuildNumber: 1550,
                developer: "Heena",
                message: [
                    {
                        messageKey: "CM_ALREADY_APPLIED_IN_CUST_REFUND",
                        category: "MFG",
                        messageType: "Error",
                        messageCode: "MFG20146",
                        message: "Crrdit Memo <b>{0}</b> already selected and applied in refund.",
                        modifiedDate: new Date(COMMON.getCurrentUTC()),
                        action: "U"
                    }
                ]
            };
            break;
        case 1550:
            msgobj = {
                messageBuildNumber: 1551,
                developer: "Heena",
                message: [
                    {
                        messageKey: "PAY_AMT_NOT_MORE_THAN_AGREEED_REF_AMT",
                        category: "MFG",
                        messageType: "Error",
                        messageCode: "MFG20143",
                        message: "<b>Refund Amount of the selected {0}(s)</b> must be less than or equal to <b>Remaning Agreed Refund Amount ($){1}</b>. Please update Refund AMT.",
                        modifiedDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 1551:
            msgobj = {
                messageBuildNumber: 1552,
                developer: "Heena",
                message: [
                    {
                        messageKey: "CUST_REFUND_DET_CHANGED_TRY_AGAIN",
                        category: "MFG",
                        messageType: "Error",
                        messageCode: "MFG20144",
                        message: "Refund details already changed. Please refresh {0} details.",
                        modifiedDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 1552:
            msgobj = {
                messageBuildNumber: 1553,
                developer: "Heena",
                message: [
                    {
                        messageKey: "CUST_REFUND_WITH_DUPLICATE_PAY_CHECK_NO_CONFM",
                        category: "MFG",
                        messageType: "Confirmation",
                        messageCode: "MFG40050",
                        message: "Refund already received with <b>{0}</b> payment# or check#. You want to receive Refund with same <b>{0}</b> payment# or check#?",
                        modifiedDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 1553:
            msgobj = {
                messageBuildNumber: 1554,
                developer: "Heena",
                message: [
                    {
                        messageKey: "PAYMENT_ALREADY_APPLIED_IN_CUST_REFUND",
                        category: "MFG",
                        messageType: "Error",
                        messageCode: "MFG20145",
                        message: "Payment <b>{0}</b> already selected and applied in refund.",
                        modifiedDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 1554:
            msgobj = {
                messageBuildNumber: 1555,
                developer: "Heena",
                message: [
                    {
                        messageKey: "CM_ALREADY_APPLIED_IN_CUST_REFUND",
                        category: "MFG",
                        messageType: "Error",
                        messageCode: "MFG20146",
                        message: "Credit Memo <b>{0}</b> already selected and applied in refund.",
                        modifiedDate: new Date(COMMON.getCurrentUTC()),
                        action: "U"
                    }
                ]
            };
            break;
        case 1555:
            msgobj = {
                messageBuildNumber: 1556,
                developer: "Shweta",
                message: [
                    {
                        messageKey: "DELETE_ALL_REF_DESG_WO_OPERATION",
                        category: "MFG",
                        messageType: "Confirmation",
                        messageCode: "MFG40052",
                        message: "This will remove all entered REF DES. Press Yes to continue.",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 1556:
            msgobj = {
                messageBuildNumber: 1557,
                developer: "Champak",
                message: [
                    {
                        messageKey: "SO_FILTETR_COMPLETED_LINE_CONFIRMATION",
                        category: "MFG",
                        messageType: "Confirmation",
                        messageCode: "MFG40051",
                        message: "You will lose all unsaved work.<br/> Are you sure you want to continue? Press Yes to continue.",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 1557:
            msgobj = {
                messageBuildNumber: 1558,
                developer: "Champak",
                message: [
                    {
                        messageKey: "QUOTE_EXPIRE_VALIDATION",
                        category: "MFG",
                        messageType: "Confirmation",
                        messageCode: "MFG40053",
                        message: "Quote# <b>{0}</b> is expired on <b>{1}</b>. Do you want to continue? Press Yes to continue.",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 1558:
            msgobj = {
                messageBuildNumber: 1559,
                developer: "Shirish",
                message: [
                    {
                        messageCode: "RFQ50035",
                        messageKey: "UNLOCK_BOM_PRIOR_TO_START_ACTIVITY",
                        messageType: "Information",
                        message: "BOM is locked in Part Master. Unlock BOM prior to starting the activity.",
                        category: "RFQ",
                        modifiedDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 1559:
            msgobj = {
                messageBuildNumber: 1560,
                developer: "Shirish",
                message: [
                    {
                        messageCode: "RFQ50036",
                        messageKey: "STOP_BOM_ACTIVITY_PROIOR_TO_LOCK_BOM",
                        messageType: "Information",
                        message: "BOM activity started. Stop BOM activity proir to LOCK BOM.",
                        category: "RFQ",
                        modifiedDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 1560:
            msgobj = {
                messageBuildNumber: 1561,
                developer: "Shirish",
                message: [
                    {
                        messageCode: "RFQ50037",
                        messageKey: "BOM_LOCKED_FROM_PART_MASTER",
                        messageType: "Information",
                        message: "BOM is {0} from Part Master.",
                        category: "RFQ",
                        modifiedDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 1561:
            msgobj = {
                messageBuildNumber: 1562,
                developer: "Champak",
                message: [
                    {
                        messageCode: "MFG50050",
                        messageKey: "SO_SHIPPING_DET_REMOVE_VALIDATION",
                        messageType: "Information",
                        message: "FCA Release# <b>{0}</b> cannot be remove because, It is already shipped for customer packing slip(s) <b>{1}</b>.",
                        category: "MFG",
                        modifiedDate: new Date(COMMON.getCurrentUTC()),
                        action: "U"
                    }
                ]
            };
            break;
        case 1562:
            msgobj = {
                messageBuildNumber: 1563,
                developer: "Champak",
                message: [
                    {
                        messageCode: "MFG20150",
                        messageKey: "RESTRICT_REMOVE_SO_OTHER_CHARGE",
                        messageType: "Error",
                        message: "You cannot remove selected SO Line# <b>{0}</b>. Cust PO Line# <b>{1}</b> added as other charges for SO Line# <b>{0}</b>. Please remove mentioned other charges then proceed further.",
                        category: "MFG",
                        modifiedDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 1563:
            msgobj = {
                messageBuildNumber: 1564,
                developer: "Ashish",
                message: [
                    {
                        messageKey: "SUPPLIER_RMA_NUMNER_EXIST_CONFIRMATION_TO_UPDATE_OR_CREATE_NEW",
                        category: "RECEIVING",
                        messageType: "Confirmation",
                        messageCode: "RCV40092",
                        message: "RMA# <b>{0}</b> already exists for supplier <b>{1}</b> as bellow.",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 1564:
            msgobj = {
                messageBuildNumber: 1565,
                developer: "Bhavik",
                message: [
                    {
                        messageKey: "DISCARD_DRAFT_CHANGES",
                        category: "REPORT",
                        messageType: "Confirmation",
                        messageCode: "RPT40001",
                        message: "Are you sure you want to discard draft changes?",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 1565:
            msgobj = {
                messageBuildNumber: 1566,
                developer: "Bhavik",
                message: [
                    {
                        messageKey: "CONFIRM_STOP_ACTIVITY",
                        category: "REPORT",
                        messageType: "Confirmation",
                        messageCode: "RPT40002",
                        message: "Are you sure you want to stop activity?",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 1566:
            msgobj = {
                messageBuildNumber: 1567,
                developer: "Bhavik",
                message: [
                    {
                        messageKey: "SUCCESSFULLY_DISCARD_CHANGES",
                        category: "REPORT",
                        messageType: "Success",
                        messageCode: "RPT10002",
                        message: "Changes discarded successfully.",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 1567:
            msgobj = {
                messageBuildNumber: 1568,
                developer: "Bhavik",
                message: [
                    {
                        messageKey: "SUCCESSFULLY_PUBLISHED",
                        category: "REPORT",
                        messageType: "Success",
                        messageCode: "RPT10003",
                        message: "Report has been published successfully.",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 1568:
            msgobj = {
                messageBuildNumber: 1569,
                developer: "Bhavik",
                message: [
                    {
                        messageKey: "SUCCESSFULLY_SAVE_AS_DRAFT",
                        category: "REPORT",
                        messageType: "Success",
                        messageCode: "RPT10004",
                        message: "Report saved as draft.",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 1569:
            msgobj = {
                messageBuildNumber: 1570,
                developer: "Shweta",
                message: [
                    {
                        messageCode: "MFG40055",
                        messageKey: "EQUIP_ONLINEPENDING_VERIFY_UMID",
                        messageType: "Confirmation",
                        message: "{0} UMID(s) pending to be Verify. Are you sure to bring equipment Online? Press Yes to continue.",
                        category: "MFG",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 1570:
            msgobj = {
                messageBuildNumber: 1571,
                developer: "Shweta",
                message: [
                    {
                        messageCode: "MFG20151",
                        messageKey: "FEEDER_NOT_LOADED",
                        messageType: "Error",
                        message: "Feeder not loaded yet! Please load feeder first.",
                        category: "MFG",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 1571:
            msgobj = {
                messageBuildNumber: 1572,
                developer: "Shweta",
                message: [
                    {
                        messageCode: "MFG20152",
                        messageKey: "INVALID_BIN_TYPE_ENTER",
                        messageType: "Error",
                        message: "Invalid bin selected.<br/> Please re-type and press enter.",
                        category: "MFG",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 1572:
            msgobj = {
                messageBuildNumber: 1573,
                developer: "Shubham",
                message: [
                    {
                        messageCode: "PRT40037",
                        messageKey: "RESET_SHELF_LIFE_DAYS_DATA",
                        messageType: "Confirmation",
                        message: "<b>Shelf Life (Days)</b> related data will be lost on unchecking the checkbox. Press Yes to Continue.",
                        category: "PARTS",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 1573:
            msgobj = {
                messageBuildNumber: 1574,
                developer: "Jay",
                message: [
                    {
                        messageKey: "CONFIRM_TO_SELECT_PO_LINE",
                        category: "RECEIVING",
                        messageType: "Confirmation",
                        messageCode: "RCV40091",
                        message: "<b>{0}</b> received against PO# <b>{1}</b><br />A. Press <b>SAME LINE</b> to receive material for selected line from below<br />B. Press <b>DIFFERENT LINE</b> to receive material in new line<br />",
                        modifiedDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 1574:
            msgobj = {
                messageBuildNumber: 1575,
                developer: "Jay",
                message: [
                    {
                        messageKey: "RECEIVED_STATUS_NOT_SET_ACCEPT",
                        category: "RECEIVING",
                        messageType: "Error",
                        messageCode: "RCV20191",
                        message: "You cannot set received status as <b>Accepted</b> as some lines having status as <b>Pending</b> or <b>Accept With Deviation</b> or <b>Rejected</b> of Inspection Requirement(s) & Verification in material details.",
                        modifiedDate: new Date(COMMON.getCurrentUTC()),
                        action: "U"
                    }
                ]
            };
            break;
        case 1575:
            msgobj = {
                messageBuildNumber: 1576,
                developer: "Jay",
                message: [
                    {
                        messageKey: "RECEIVED_STATUS_NOT_SET_AT_ADD_TIME",
                        category: "RECEIVING",
                        messageType: "Error",
                        messageCode: "RCV20193",
                        message: "You cannot change the <b>Received Status</b> to <b>Accepted</b> or <b>Accept With Deviation</b> or <b>Rejected</b> as this part requires checking <b>Purchase Inspection Requirement(s)</b> by clicking on <b>Add</b> button. So please check that first then change the <b>Receiving Status</b>.",
                        modifiedDate: new Date(COMMON.getCurrentUTC()),
                        action: "U"
                    }
                ]
            };
            break;
        case 1576:
            msgobj = {
                messageBuildNumber: 1577,
                developer: "Jay",
                message: [
                    {
                        messageKey: "RECEIVING_AND_PACKINGSLIP_QTY_MISSMATCH_CONFIRMATION",
                        category: "RECEIVING",
                        messageType: "Confirmation",
                        messageCode: "RCV40076",
                        message: "<b>Packing Slip Qty</b> and <b>Received Qty</b> is mismatched. Are you sure you want to continue?",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "U"
                    }
                ]
            };
            break;
        case 1577:
            msgobj = {
                messageBuildNumber: 1578,
                developer: "Jay",
                message: [
                    {
                        messageKey: "CONFIRM_TO_SELECT_FROM_PO",
                        category: "RECEIVING",
                        messageType: "Confirmation",
                        messageCode: "RCV40089",
                        message: "Prior to select from PO, you have to save data or reset data.",
                        modifiedDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 1578:
            msgobj = {
                messageBuildNumber: 1579,
                developer: "Shirish",
                message: [
                    {
                        messageCode: "RFQ50038",
                        messageKey: "BOM_PART_DETAILS_MODIFIED",
                        messageType: "Information",
                        message: "Part {0} detail modified from Part Master.",
                        category: "RFQ",
                        modifiedDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 1579:
            msgobj = {
                messageBuildNumber: 1580,
                developer: "Jay",
                message: [
                    {
                        messageKey: "CONFIRM_TO_SELECT_PO_LINE",
                        category: "RECEIVING",
                        messageType: "Confirmation",
                        messageCode: "RCV40091",
                        message: "<b>{0}</b> received against PO# <b>{1}</b>.<br /><br />A. Press <b>SAME PO LINEID</b> to receive material for selected line from below<br />B. Press <b>DIFFERENT PO LINEID</b> to receive material in new line<br />",
                        modifiedDate: new Date(COMMON.getCurrentUTC()),
                        action: "U"
                    }
                ]
            };
            break;
        case 1580:
            msgobj = {
                messageBuildNumber: 1581,
                developer: "Jay",
                message: [
                    {
                        messageKey: "RECEIVING_AND_PACKINGSLIP_QTY_MISSMATCH_CONFIRMATION",
                        category: "RECEIVING",
                        messageType: "Confirmation",
                        messageCode: "RCV40076",
                        message: "<b>Packing Slip/Ship Qty</b> and <b>Received Qty</b> is mismatched. Are you sure you want to continue?",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "U"
                    }
                ]
            };
            break;
        case 1581:
            msgobj = {
                messageBuildNumber: 1582,
                developer: "Charmi",
                message: [
                    {
                        messageCode: "RCV20284",
                        messageKey: "SHELF_LIFE_DAYS_FOR_MOUNTING_GROUP_CHEMICAL_VALIDATION",
                        messageType: "Error",
                        message: "Shelf Life details are not added for Part <b>{0}</b> part details, Press Continue to redirect on Part Master detail.",
                        category: "RECEIVING",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 1582:
            msgobj = {
                messageBuildNumber: 1583,
                developer: "Charmi",
                message: [
                    {
                        messageCode: "RCV40091",
                        messageKey: "SHELF_LIFE_DAYS_FOR_MOUNTING_GROUP_CHEMICAL_CONFIRMATION",
                        messageType: "Error",
                        message: "Shelf Life details are not added for Part <b>{0}</b> part details, Press Continue to redirect on Part Master detail.",
                        category: "RECEIVING",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 1583:
            msgobj = {
                messageBuildNumber: 1584,
                developer: "Ashish",
                message: [
                    {
                        messageKey: "SUPPLIER_TRANSACTION_DELETE_VALIDATION_IF_MEMO_CREATED",
                        category: "RECEIVING",
                        messageType: "Error",
                        messageCode: "RCV20285",
                        message: "You cannot delete selected invoice(s) as some invoice(s) have <b>Debit Memo</b> or <b>Credit Memo</b> created. Please check selected invoices.",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 1584:
            msgobj = {
                messageBuildNumber: 1585,
                developer: "Charmi",
                message: [
                    {
                        messageCode: "RCV30025",
                        messageKey: "CHANGE_DATE_TYPE_FOR_UMID",
                        messageType: "Warning",
                        message: "<b>Date of Manufacture/Expiry </b> will be lost on changing Shelf Life Date Type. Press Yes to Continue.",
                        category: "RECEIVING",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 1585:
            msgobj = {
                messageBuildNumber: 1586,
                developer: "Charmi",
                message: [
                    {
                        messageCode: "RCV20286",
                        messageKey: "SHELF_LIFE_DATE_TYPE_FOR_LIMITED_SHELF_LIFE",
                        messageType: "Error",
                        message: "Selected <b>Part {0}</b> is having limited shelf life, it is required to enter <b>Date of Manufacture/Expiry </b>. Please add Shelf Life details for UMID.",
                        category: "RECEIVING",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 1586:
            msgobj = {
                messageBuildNumber: 1587,
                developer: "Charmi",
                message: [
                    {
                        messageCode: "RCV50016",
                        messageKey: "SHELF_LIFE_UPON_PART_MASTER",
                        messageType: "Information",
                        message: "Hint: Parts with having Mounting type with true value in 'Has Limited Life', will be required to select Shelf Life Date Type other than 'None'.",
                        category: "RECEIVING",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "U"
                    }
                ]
            };
            break;
        case 1587:
            msgobj = {
                messageBuildNumber: 1588,
                developer: "Ashish",
                message: [
                    {
                        messageKey: "PACKING_SLIP_CHANGE_SHIPPED_QTY_VALIDATION",
                        category: "RECEIVING",
                        messageType: "Error",
                        messageCode: "RCV20287",
                        message: "In prior to change <b>Packing Slip#</b>transfer stock first.</br></br><ul><li><b>Pending UMID part:</b> Transfer part to last known bin to delete the line.</li><li><b>UMID part:</b> Transfer part to any bin to delete the line.</li></ul>",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 1588:
            msgobj = {
                messageBuildNumber: 1589,
                developer: "Jay",
                message: [
                    {
                        messageKey: "RECEIVED_STATUS_NOT_SET_ACCEPT",
                        category: "RECEIVING",
                        messageType: "Error",
                        messageCode: "RCV20191",
                        message: "You cannot set received status as <b>Accepted</b> or <b>Accept With Deviation</b> as some lines having status as <b>Pending</b> or <b>Rejected</b> of Inspection Requirement(s) & Verification in material details.",
                        modifiedDate: new Date(COMMON.getCurrentUTC()),
                        action: "U"
                    }
                ]
            };
            break;
        case 1589:
            msgobj = {
                messageBuildNumber: 1590,
                developer: "Charmi",
                message: [
                    {
                        messageCode: "RCV20286",
                        messageKey: "SHELF_LIFE_DATE_TYPE_FOR_LIMITED_SHELF_LIFE",
                        messageType: "Error",
                        message: "Selected part <b>{0}</b> is having limited shelf life. Please add Date of Manufacture/Expiry.",
                        category: "RECEIVING",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "U"
                    }
                ]
            };
            break;
        case 1590:
            msgobj = {
                messageBuildNumber: 1591,
                developer: "Charmi",
                message: [{
                    messageCode: "RCV40091",
                    messageKey: "SHELF_LIFE_DAYS_FOR_MOUNTING_GROUP_CHEMICAL_CONFIRMATION",
                    messageType: "Confirmation",
                    category: "RECEIVING",
                    deletedDate: new Date(COMMON.getCurrentUTC()),
                    action: "D"
                }]
            };
            break;
        case 1591:
            msgobj = {
                messageBuildNumber: 1592,
                developer: "Charmi",
                message: [
                    {
                        messageKey: "CONFIRM_TO_SELECT_PO_LINE",
                        category: "RECEIVING",
                        messageType: "Confirmation",
                        messageCode: "RCV40091",
                        message: "<b>{0}</b> received against PO# <b>{1}</b>.<br /><br />A. Press <b>SAME PO LINE ID</b> to receive material for selected line from below<br />B. Press <b>DIFFERENT PO LINE ID</b> to receive material in new line<br />",
                        modifiedDate: new Date(COMMON.getCurrentUTC()),
                        action: "U"
                    }
                ]
            };
            break;
        case 1592:
            msgobj = {
                messageBuildNumber: 1593,
                developer: "Charmi",
                message: [
                    {
                        messageCode: "RCV40093",
                        messageKey: "SHELF_LIFE_DAYS_FOR_MOUNTING_GROUP_CHEMICAL_CONFIRMATION",
                        messageType: "Confirmation",
                        message: "Shelf Life details are not added for Part <b>{0}</b> part details, Press Continue to redirect on Part Master detail.",
                        category: "RECEIVING",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 1593:
            msgobj = {
                messageBuildNumber: 1594,
                developer: "Shirish",
                message: [
                    {
                        messageCode: "RFQ50039",
                        messageKey: "PRICING_MISMATCH_WITH_PART_COSTING_AND_COST_SUMMARY",
                        messageType: "Information",
                        message: "Material Cost of Part Costing tab & Cost Summary tab is mismatched.<br/> Please <b>SUBMIT FOR COST SUMMARY</b> from Part Costing tab in prior to submitting quote.",
                        category: "RFQ",
                        modifiedDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 1594:
            msgobj = {
                messageBuildNumber: 1595,
                developer: "Shirish",
                message: [
                    {
                        messageCode: "RFQ50040",
                        messageKey: "LABOR_MISMATCH_WITH_LABOR_COST_AND_COST_SUMMARY",
                        messageType: "Information",
                        message: "Labor Cost of Labor Cost tab & Cost Summary tab is mismatched.<br/>Please <b>SUBMIT LABOR TO SUMMARY</b> from Labor Cost tab in prior to submitting quote.",
                        category: "RFQ",
                        modifiedDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 1595:
            msgobj = {
                messageBuildNumber: 1596,
                developer: "Jay",
                message: [
                    {
                        messageKey: "PO_RELEASE_LINE_IS_NOT_EXISTS",
                        category: "RECEIVING",
                        messageType: "Error",
                        messageCode: "RCV20288",
                        message: "Selected part <b>{0}</b> is deleted from PO# <b>{1}</b> from PO Line ID <b>{2}</b> and Release Line# <b>{3}</b>. Please check PO first and to receive part please select 'Receive as Wrong Part' option.",
                        modifiedDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 1596:
            msgobj = {
                messageBuildNumber: 1597,
                developer: "Jay",
                message: [
                    {
                        messageKey: "PO_RELEASE_LINE_IS_NOT_EXISTS",
                        category: "RECEIVING",
                        messageType: "Error",
                        messageCode: "RCV20288",
                        message: "Selected part <b>{0}</b> is deleted from PO# <b>{1}</b> from PO Line ID <b>{2}</b> and Release Line# <b>{3}</b>. Please check PO first and to receive part please select <b>'Receive as Wrong Part'</b> option.",
                        modifiedDate: new Date(COMMON.getCurrentUTC()),
                        action: "U"
                    }
                ]
            };
            break;
        case 1597:
            msgobj = {
                messageBuildNumber: 1598,
                developer: "Shirish",
                message: [
                    {
                        messageCode: "RFQ50036",
                        messageKey: "STOP_BOM_ACTIVITY_PROIOR_TO_LOCK_BOM",
                        messageType: "Information",
                        message: "BOM activity started. Stop BOM activity prior to LOCK BOM.",
                        category: "RFQ",
                        modifiedDate: new Date(COMMON.getCurrentUTC()),
                        action: "U"
                    }
                ]
            };
            break;
        case 1598:
            msgobj = {
                messageBuildNumber: 1599,
                developer: "Ashish",
                message: [
                    {
                        messageKey: "PACKING_SLIP_CHANGE_SHIPPED_QTY_VALIDATION",
                        category: "RECEIVING",
                        messageType: "Error",
                        messageCode: "RCV20287",
                        message: "In prior to change <b>Packing Slip#</b> transfer stock first.</br></br><ul><li><b>Pending UMID part:</b> Transfer part to last known bin to delete the line.</li><li><b>UMID part:</b> Transfer part to any bin to delete the line.</li></ul>",
                        modifiedDate: new Date(COMMON.getCurrentUTC()),
                        action: "U"
                    }
                ]
            };
            break;
        case 1599:
            msgobj = {
                messageBuildNumber: 1600,
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
        case 1600:
            msgobj = {
                messageBuildNumber: 1601,
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
        case 1601:
            msgobj = {
                messageBuildNumber: 1602,
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
        case 1602:
            msgobj = {
                messageBuildNumber: 1603,
                developer: "SHUBHAM",
                message: [
                    {
                        messageKey: "DELETE_CONFIRM_WITH_DISPLAY_DETAIL_LIST_MESSAGE",
                        category: "GLOBAL",
                        messageType: "Error",
                        messageCode: "GLB20064",
                        message: "Following details will be removed from {0} while deleting selected {1} {0}(s). Press Yes to continue.",
                        modifiedDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 1603:
            msgobj = {
                messageBuildNumber: 1604,
                developer: "SHUBHAM",
                message: [
                    {
                        messageKey: "DELETE_CONFIRM_WITH_DISPLAY_DETAIL_LIST_MESSAGE",
                        category: "GLOBAL",
                        messageType: "Error",
                        messageCode: "GLB20064",
                        message: "Following details will be removed from {0} while deleting selected {1} {0}(s). Are you sure you want to delete? Press Yes to continue.",
                        modifiedDate: new Date(COMMON.getCurrentUTC()),
                        action: "U"
                    }
                ]
            };
            break;
        case 1604:
            msgobj = {
                messageBuildNumber: 1605,
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
        case 1605:
            msgobj = {
                messageBuildNumber: 1606,
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
        case 1606:
            msgobj = {
                messageBuildNumber: 1607,
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
        case 1607:
            msgobj = {
                messageBuildNumber: 1608,
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
        case 1608:
            msgobj = {
                messageBuildNumber: 1609,
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
        case 1609:
            msgobj = {
                messageBuildNumber: 1610,
                developer: "Charmi",
                message: [{
                    messageCode: "RCV20289",
                    messageKey: "PO_RELEASE_LINE_IS_NOT_EXISTS",
                    messageType: "Error",
                    category: "RECEIVING",
                    deletedDate: new Date(COMMON.getCurrentUTC()),
                    action: "D"
                }]
            };
            break;
        case 1610:
            msgobj = {
                messageBuildNumber: 1611,
                developer: "Charmi",
                message: [
                    {
                        messageKey: "PO_RELEASE_LINE_IS_NOT_EXISTS",
                        category: "RECEIVING",
                        messageType: "Error",
                        messageCode: "RCV20289",
                        message: "Selected part <b>{0}</b> is deleted from PO# <b>{1}</b> from PO Line ID <b>{2}</b> and Release Line# <b>{3}</b>. Please check PO first and to receive part please select <b>'Receive as Wrong Part'</b> option.",
                        category: "RECEIVING",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 1611:
            msgobj = {
                messageBuildNumber: 1612,
                developer: "Charmi",
                message: [
                    {
                        messageKey: "PS_POSTING_STATUS_NOT_ALLOW",
                        category: "RECEIVING",
                        messageType: "Error",
                        messageCode: "RCV20292",
                        message: "You can not {0} the {1} as packing slip# <b>{2}</b> is in <b>Draft</b> mode for available stock of part <b>{3}</b> with packaging <b>{4}</b> in bin <b>{5}</b>.",
                        category: "RECEIVING",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 1612:
            msgobj = {
                messageBuildNumber: 1613,
                developer: "Charmi",
                message: [
                    {
                        messageKey: "PS_RECEIVED_STATUS_NOT_ALLOW_UMID",
                        category: "RECEIVING",
                        messageType: "Error",
                        messageCode: "RCV20165",
                        message: "You can not create the UMID as line received status of packing slip# <b>{0}</b> is <b>{1}</b> for available stock of part <b>{2}</b> with packaging <b>{3}</b> in bin <b>{4}</b>.",
                        modifiedDate: new Date(COMMON.getCurrentUTC()),
                        action: "U"
                    }
                ]
            };
            break;
        case 1613:
            msgobj = {
                messageBuildNumber: 1614,
                developer: "Charmi",
                message: [
                    {
                        messageKey: "PS_POSTING_STATUS_NOT_ALLOW_CHANGE_INITALQTY",
                        category: "RECEIVING",
                        messageType: "Error",
                        messageCode: "RCV20293",
                        message: "You are not allowed to change initial qty of scanned UMID <b>{0}</b> as supplier packing slip# <b>{1}</b> is in <b>Draft</b> mode.",
                        category: "RECEIVING",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 1614:
            msgobj = {
                messageBuildNumber: 1615,
                developer: "Charmi",
                message: [
                    {
                        messageKey: "REMOVE_UID_PS_STATUS_VALIDATION",
                        category: "RECEIVING",
                        messageType: "Error",
                        messageCode: "RCV20294",
                        message: "Status of supplier packing slip for following UMID(s) is Draft. So you can not delete UMID(s).",
                        category: "RECEIVING",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 1615:
            msgobj = {
                messageBuildNumber: 1616,
                developer: "Ashish",
                message: [
                    {
                        messageKey: "PACKING_SLIP_IN_DRAFT_INVOICE_NOT_CREATE",
                        category: "RECEIVING",
                        messageType: "Error",
                        messageCode: "RCV20189",
                        message: "You cannot create {0} as Packing slip <b>{1}</b> is in <b>Draft</b> mode.",
                        modifiedDate: new Date(COMMON.getCurrentUTC()),
                        action: "U"
                    }
                ]
            };
            break;
        case 1616:
            msgobj = {
                messageBuildNumber: 1617,
                developer: "Shubham",
                message: [
                    {
                        messageKey: "COMPONENT_ASSEMBLY_NICKNAME_DUPLICATE_MESSAGE",
                        category: "PARTS",
                        messageType: "Error",
                        messageCode: "PRT20004",
                        message: "<b>{0}</b> nickname is already used in following part(s), please use different nickname.",
                        modifiedDate: new Date(COMMON.getCurrentUTC()),
                        action: "U"
                    }
                ]
            };
            break;
        case 1617:
            msgobj = {
                messageBuildNumber: 1618,
                developer: "Shubham",
                message: [
                    {
                        messageKey: "COMPONENT_MPN_PIDCODE_UPDATE_CONFIRMATION_MESSAGE",
                        category: "PARTS",
                        messageType: "Confirmation",
                        messageCode: "PRT40038",
                        message: "Are you sure to update part MPN and PID Code? Press Yes to Continue.",
                        modifiedDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 1618:
            msgobj = {
                messageBuildNumber: 1619,
                developer: "Shubham",
                message: [
                    {
                        messageKey: "RESTRICT_UPATE_PART_MPN_ON_SO_CREATED",
                        category: "PARTS",
                        messageType: "Error",
                        messageCode: "PRT20044",
                        message: "Sales order is already created for this Part, so you cannot modify details of this part.",
                        modifiedDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 1618:
            msgobj = {
                messageBuildNumber: 1619,
                developer: "Shubham",
                message: [
                    {
                        messageKey: "RESTRICT_SET_INCORRECT_FOR_REFER_FOR_CORRECT_PART",
                        category: "PARTS",
                        messageType: "Error",
                        messageCode: "PRT20045",
                        message: "You cannot set this part as <b>'Incorrect Part'</b> as it's already used as <b>'Corrected Part'</b> into <b>{0}</b>",
                        modifiedDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 1619:
            msgobj = {
                messageBuildNumber: 1620,
                developer: "Shubham",
                message: [
                    {
                        messageKey: "UPDATE_MPN_PID_ASSEMBLY",
                        category: "PARTS",
                        messageType: "Information",
                        messageCode: "PRT50017",
                        message: "You can update only RFQ only Assembly.",
                        modifiedDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 1620:
            msgobj = {
                messageBuildNumber: 1621,
                developer: "Shubham",
                message: [
                    {
                        messageKey: "UPDATE_MPN_PID_ASSEMBLY",
                        category: "PARTS",
                        messageType: "Information",
                        messageCode: "PRT50017",
                        message: "You can update assemblies with 'RFQ Only'[Sales Order not created].",
                        modifiedDate: new Date(COMMON.getCurrentUTC()),
                        action: "U"
                    }
                ]
            };
            break;
        case 1621:
            msgobj = {
                messageBuildNumber: 1622,
                developer: "Jay",
                message: [
                    {
                        messageKey: "NOT_ALLOW_TO_CREATE_RMA_PACKING_SLIP_IS_DRAFT",
                        category: "RECEIVING",
                        messageType: "Error",
                        messageCode: "RCV20296",
                        message: "In prior to create supplier RMA, Packing slip must in <b>Publish</b>.",
                        modifiedDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 1622:
            msgobj = {
                messageBuildNumber: 1623,
                developer: "Charmi",
                message: [
                    {
                        messageCode: "RCV20295",
                        messageKey: "NOT_ALLOW_SAME_AS_INITIAL_COUNT",
                        messageType: "Error",
                        message: "You are not allowed to change <b>initial count {0}</b> same as <b>current initial count {1}</b>.",
                        category: "RECEIVING",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 1623:
            msgobj = {
                messageBuildNumber: 1624,
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
        case 1624:
            msgobj = {
                messageBuildNumber: 1625,
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
        case 1625:
            msgobj = {
                messageBuildNumber: 1626,
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
        case 1626:
            msgobj = {
                messageBuildNumber: 1627,
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
        case 1627:
            msgobj = {
                messageBuildNumber: 1628,
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
        case 1628:
            msgobj = {
                messageBuildNumber: 1629,
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
        case 1629:
            msgobj = {
                messageBuildNumber: 1630,
                developer: "Bhavik",
                message: [
                    {
                        messageKey: "INVALID_USERNAME_OR_EMAILID",
                        category: "MASTER",
                        messageType: "Error",
                        messageCode: "MST20075",
                        message: "Invalid UserName Or Email.",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 1630:
            msgobj = {
                messageBuildNumber: 1631,
                developer: "Charmi",
                message: [{
                    messageCode: "RCV20089",
                    messageKey: "KIT_RELEASE_DONE_MRP_KIT_QTY_NOT_CHANGE",
                    messageType: "Error",
                    category: "RECEIVING",
                    deletedDate: new Date(COMMON.getCurrentUTC()),
                    action: "D"
                }]
            };
            break;
        case 1631:
            msgobj = {
                messageBuildNumber: 1632,
                developer: "Ashish",
                message: [
                    {
                        messageKey: "PS_POSTING_STATUS_NOT_ALLOW",
                        category: "RECEIVING",
                        messageType: "Error",
                        messageCode: "RCV20292",
                        message: "You cannot create the UMID as packing slip# {0} is in <b>Draft</b> mode for available stock of part <b>{1}</b> with packaging <b>{2}</b> in bin <b>{3}</b>.",
                        modifiedDate: new Date(COMMON.getCurrentUTC()),
                        action: "U"
                    }
                ]
            };
            break;
        case 1632:
            msgobj = {
                messageBuildNumber: 1633,
                developer: "Shweta",
                message: [
                    {
                        messageKey: "CONFIRM_POTYPE_CHANGE_INITIAL_ASSY_STOCK",
                        category: "MFG",
                        messageType: "Confirmation",
                        messageCode: "MFG40059",
                        message: "All entered details will be lost, Are you sure want to continue?. Press Yes to Continue.",
                        modifiedDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 1633:
            msgobj = {
                messageBuildNumber: 1634,
                developer: 'Shweta',
                message: [
                    {
                        messageCode: 'MFG50043',
                        messageKey: 'VERIFY_WORKORDER_FIRST',
                        messageType: 'Information',
                        message: 'To publish work order, you must verify work order operation(s) from header section.',
                        category: 'MFG',
                        modifiedDate: new Date(COMMON.getCurrentUTC()),
                        action: 'U'
                    }
                ]
            };
            break;
        case 1632:
            msgobj = {
                messageBuildNumber: 1633,
                developer: "Ashish",
                message: [
                    {
                        messageKey: "PS_POSTING_STATUS_NOT_ALLOW",
                        category: "RECEIVING",
                        messageType: "Error",
                        messageCode: "RCV20292",
                        message: "You cannot {0} the {1} as packing slip# <b>{2}</b> is in <b>Draft</b> mode for available stock of part <b>{3}</b> with packaging <b>{4}</b> in bin <b>{5}</b>.",
                        modifiedDate: new Date(COMMON.getCurrentUTC()),
                        action: "U"
                    }
                ]
            };
            break;
        case 1633:
            msgobj = {
                messageBuildNumber: 1634,
                developer: "Champak",
                message: [
                    {
                        messageKey: "UNDO_CANCELLATION_SO_DETAIL",
                        category: "MFG",
                        messageType: "Confirmation",
                        messageCode: "MFG40056",
                        message: "Are you sure to undo cancellation Cust PO Line# <b>{0}</b> of the SO# <b>{1}</b>?",
                        modifiedDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 1634:
            msgobj = {
                messageBuildNumber: 1635,
                developer: "Shweta",
                message: [
                    {
                        messageKey: "SINGLE_LOCK_RECORD_ERROR",
                        category: "MFG",
                        messageType: "Error",
                        messageCode: "MFG20123",
                        message: "You cannot lock record as it is already <b>locked</b> or in {1} status <b>{0}</b>.",
                        modifiedDate: new Date(COMMON.getCurrentUTC()),
                        action: "U"
                    }
                ]
            };
            break;
        case 1635:
            msgobj = {
                messageBuildNumber: 1636,
                developer: "Shubham",
                message: [
                    {
                        messageKey: "UPDATE_MPN_PID_ASSEMBLY",
                        messageCode: "PRT50017",
                        category: "PARTS",
                        deletedDate: new Date(COMMON.getCurrentUTC()),
                        action: "D"
                    },
                ]
            };
            break;
        case 1636:
            msgobj = {
                messageBuildNumber: 1637,
                developer: "Shubham",
                message: [
                    {
                        messageKey: "UPDATE_MPN_PID_ASSEMBLY",
                        category: "PARTS",
                        messageType: "Information",
                        messageCode: "PRT50018",
                        message: "You can update assemblies with 'RFQ Only'[Sales Order not created].",
                        modifiedDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 1637:
            msgobj = {
                messageBuildNumber: 1638,
                developer: "Jay",
                message: [
                    {
                        messageKey: "PART_ALIAS_VALIDATIONS_COPIED_SUCCESSFULL",
                        category: "PARTS",
                        messageType: "Information",
                        messageCode: "PRT50019",
                        message: "Part Alias Validations Copied Successfully.",
                        modifiedDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 1638:
            msgobj = {
                messageBuildNumber: 1639,
                developer: "Jay",
                message: [
                    {
                        messageKey: "BIN_CONTAIN_SAME_PART_WITH_SAME_STATUS",
                        category: "RECEIVING",
                        messageType: "Error",
                        messageCode: "RCV20297",
                        message: "You cannot add this material to bin <b>{0}</b> as the Received Decision is selected as <b>{1}</b>. Please update it <b>{2}</b> or add material to a different Bin.<br /> a) Press <b>Continue</b> to change Bin.<br />b) Press <b>Cancel</b> to change the Received Decision.",
                        modifiedDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 1639:
            msgobj = {
                messageBuildNumber: 1640,
                developer: "Jay",
                message: [
                    {
                        messageKey: "NOT_ALLOW_TO_REDUCE_PACKING_SLIP_QTY_THEN_RMA_QTY",
                        category: "RECEIVING",
                        messageType: "Error",
                        messageCode: "RCV20298",
                        message: "You cannot update received quantity less than RMA created quantity i.e., <b>{0}</b>.",
                        modifiedDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 1640:
            msgobj = {
                messageBuildNumber: 1641,
                developer: "Jay",
                message: [
                    {
                        messageKey: "PACKING_SLIP_RMA_CREATED",
                        category: "RECEIVING",
                        messageType: "Error",
                        messageCode: "RCV20299",
                        message: "You cannot delete material detail(s) as RMA created.",
                        modifiedDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 1641:
            msgobj = {
                messageBuildNumber: 1642,
                developer: "Shubham",
                message: [
                    {
                        messageCode: "RPT20002",
                        messageKey: "DYNAMIC_REPORT_DELETE_MESSAGE",
                        messageType: "Error",
                        message: "Activity has been started for {0} Report. You cannot delete it.",
                        category: "REPORT",
                        modifiedDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 1642:
            msgobj = {
                messageBuildNumber: 1643,
                developer: "Jay",
                message: [
                    {
                        messageKey: "BIN_CONTAIN_SAME_PART_WITH_SAME_STATUS",
                        category: "RECEIVING",
                        messageType: "Error",
                        messageCode: "RCV20297",
                        message: "You cannot add this Part <b>{0}</b> to Bin <b>{1}</b> with <b>{2}</b> Received Decision as same Part with <b>{3}</b> Received Status is already added in same Bin. Please update it <b>{4}</b> or add material to a different Bin by scanning the following field.<br /> a) Press <b>Continue</b> to change Bin.<br />b) Press <b>Cancel</b> to change the Received Decision.",
                        modifiedDate: new Date(COMMON.getCurrentUTC()),
                        action: "U"
                    }
                ]
            };
            break;
        case 1643:
            msgobj = {
                messageBuildNumber: 1644,
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
        case 1644:
            msgobj = {
                messageBuildNumber: 1645,
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
        case 1645:
            msgobj = {
                messageBuildNumber: 1646,
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
        case 1646:
            msgobj = {
                messageBuildNumber: 1647,
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
        case 1647:
            msgobj = {
                messageBuildNumber: 1648,
                developer: "Shirish",
                message: [
                    {
                        messageCode: "RFQ50042",
                        messageKey: "SELECT_ANY_PART_FIRST_TO_PROCESS",
                        messageType: "Information",
                        message: "Please select at least one <b>{0}</b> part from the list for further process.",
                        category: "RFQ",
                        modifiedDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 1648:
            msgobj = {
                messageBuildNumber: 1649,
                developer: "Shirish",
                message: [
                    {
                        messageCode: "RFQ50037",
                        messageKey: "BOM_LOCKED_FROM_PART_MASTER",
                        messageType: "Information",
                        message: "BOM is {0} from Part Master by {1}.",
                        category: "RFQ",
                        modifiedDate: new Date(COMMON.getCurrentUTC()),
                        action: "U"
                    }
                ]
            };
            break;
        case 1649:
            msgobj = {
                messageBuildNumber: 1650,
                developer: "Shirish",
                message: [
                    {
                        messageCode: "MST40002",
                        messageKey: "ADD_ALTERNATE_PART_CONFIRMATION_BOM_BODY_MESSAGE",
                        messageType: "Confirmation",
                        message: "CPN is used in following assemblies that will get effect. Are you sure you want to add {0} as an AVL part? Press Yes to Continue.",
                        category: "MASTER",
                        modifiedDate: new Date(COMMON.getCurrentUTC()),
                        action: "U"
                    }
                ]
            };
            break;
        case 1650:
            msgobj = {
                messageBuildNumber: 1651,
                developer: "Shweta",
                message: [
                    {
                        messageCode: "MFG40068",
                        messageKey: "SHIP_NEARBY_EXPIRE_UMID",
                        messageType: "Confirmation",
                        message: "UMID <b>{0}</b> selected for shipment has Expiry Date: <b>{1} </b>. Are you sure to continue ? Press Yes to continue.",
                        category: "MFG",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 1651:
            msgobj = {
                messageBuildNumber: 1652,
                developer: "Shweta",
                message: [{
                    messageKey: "FEEDER_VERIFIED",
                    category: "MFG",
                    messageType: "Success",
                    messageCode: "MFG10018",
                    message: "Feeder & UMID Verified successfully",
                    createdDate: new Date(COMMON.getCurrentUTC()),
                    action: "I"
                }]
            };
            break;
        case 1652:
            msgobj = {
                messageBuildNumber: 1653,
                developer: "Shweta",
                message: [{
                    messageKey: "FEEDER_SCANNED",
                    category: "MFG",
                    messageType: "Success",
                    messageCode: "MFG10019",
                    message: "Feeder is loaded with UMID successfully",
                    createdDate: new Date(COMMON.getCurrentUTC()),
                    action: "I"
                }]
            };
            break;
        case 1653:
            msgobj = {
                messageBuildNumber: 1654,
                developer: "Shweta",
                message: [{
                    messageKey: "UMID_VERIFIED",
                    category: "MFG",
                    messageType: "Success",
                    messageCode: "MFG10020",
                    message: "UMID verified successfully",
                    createdDate: new Date(COMMON.getCurrentUTC()),
                    action: "I"
                }]
            };
            break;
        case 1654:
            msgobj = {
                messageBuildNumber: 1655,
                developer: "Shweta",
                message: [{
                    messageKey: "UMID_SCANNED",
                    category: "MFG",
                    messageType: "Success",
                    messageCode: "MFG10021",
                    message: "UMID scanned successfully",
                    createdDate: new Date(COMMON.getCurrentUTC()),
                    action: "I"
                }]
            };
            break;
        case 1655:
            msgobj = {
                messageBuildNumber: 1656,
                developer: "Shweta",
                message: [{
                    messageKey: "UMID_ALLOCATED_SUCCESS",
                    category: "MFG",
                    messageType: "Success",
                    messageCode: "MFG10022",
                    message: "UMID Allocated successfully.",
                    createdDate: new Date(COMMON.getCurrentUTC()),
                    action: "I"
                }]
            };
            break;
        case 1656:
            msgobj = {
                messageBuildNumber: 1657,
                developer: "Shweta",
                message: [{
                    messageKey: "FEEDER_FAILED",
                    category: "MFG",
                    messageType: "Error",
                    messageCode: "MFG20158",
                    message: "Feeder verification failed",
                    createdDate: new Date(COMMON.getCurrentUTC()),
                    action: "I"
                }]
            };
            break;
        case 1657:
            msgobj = {
                messageBuildNumber: 1658,
                developer: "Shweta",
                message: [{
                    messageKey: "FEEDER_INVALID",
                    category: "MFG",
                    messageType: "Error",
                    messageCode: "MFG20159",
                    message: "Invalid feeder location.",
                    createdDate: new Date(COMMON.getCurrentUTC()),
                    action: "I"
                }]
            };
            break;
        case 1658:
            msgobj = {
                messageBuildNumber: 1659,
                developer: "Shweta",
                message: [{
                    messageKey: "FEEDER_REQUIRED",
                    category: "MFG",
                    messageType: "Error",
                    messageCode: "MFG20160",
                    message: "Enter feeder location.",
                    createdDate: new Date(COMMON.getCurrentUTC()),
                    action: "I"
                }]
            };
            break;
        case 1659:
            msgobj = {
                messageBuildNumber: 1660,
                developer: "Shweta",
                message: [{
                    messageKey: "FEEDER_INACTIVE",
                    category: "MFG",
                    messageType: "Error",
                    messageCode: "MFG20161",
                    message: "Feeder currently inactive for equipment",
                    createdDate: new Date(COMMON.getCurrentUTC()),
                    action: "I"
                }]
            };
            break;
        case 1660:
            msgobj = {
                messageBuildNumber: 1661,
                developer: "Shweta",
                message: [{
                    messageKey: "FEEDER_NOT_ALLOCATED_YET",
                    category: "MFG",
                    messageType: "Error",
                    messageCode: "MFG20162",
                    message: "Feeder not allocated for equipment",
                    createdDate: new Date(COMMON.getCurrentUTC()),
                    action: "I"
                }]
            };
            break;
        case 1661:
            msgobj = {
                messageBuildNumber: 1662,
                developer: "Shweta",
                message: [{
                    messageKey: "UMID_FAILED",
                    category: "MFG",
                    messageType: "Error",
                    messageCode: "MFG20163",
                    message: "UMID verification failed",
                    createdDate: new Date(COMMON.getCurrentUTC()),
                    action: "I"
                }]
            };
            break;
        case 1662:
            msgobj = {
                messageBuildNumber: 1663,
                developer: "Shweta",
                message: [{
                    messageKey: "UMID_INVALID",
                    category: "MFG",
                    messageType: "Error",
                    messageCode: "MFG20164",
                    message: "Invalid UMID",
                    createdDate: new Date(COMMON.getCurrentUTC()),
                    action: "I"
                }]
            };
            break;
        case 1663:
            msgobj = {
                messageBuildNumber: 1664,
                developer: "Shweta",
                message: [{
                    messageKey: "UMID_NOT_IN_WORKORDER_OR_KIT",
                    category: "MFG",
                    messageType: "Error",
                    messageCode: "MFG20165",
                    message: "UMID not assigned in work order operation or kit",
                    createdDate: new Date(COMMON.getCurrentUTC()),
                    action: "I"
                }]
            };
            break;
        case 1664:
            msgobj = {
                messageBuildNumber: 1665,
                developer: "Shweta",
                message: [{
                    messageKey: "UMID_NOT_ASSIGNED",
                    category: "MFG",
                    messageType: "Error",
                    messageCode: "MFG20166",
                    message: "UMID not assigned in bill of material",
                    createdDate: new Date(COMMON.getCurrentUTC()),
                    action: "I"
                }]
            };
            break;
        case 1665:
            msgobj = {
                messageBuildNumber: 1666,
                developer: "Shweta",
                message: [{
                    messageKey: "UMID_NOT_ALLOCATED",
                    category: "MFG",
                    messageType: "Error",
                    messageCode: "MFG20167",
                    message: "UMID not assigned in bill of material or not allocated in kit",
                    createdDate: new Date(COMMON.getCurrentUTC()),
                    action: "I"
                }]
            };
            break;
        case 1666:
            msgobj = {
                messageBuildNumber: 1667,
                developer: "Shweta",
                message: [{
                    messageKey: "UMID_RESTRICTED_FROM_BOM",
                    category: "MFG",
                    messageType: "Error",
                    messageCode: "MFG20168",
                    message: "Part restricted to use from bill of material level",
                    createdDate: new Date(COMMON.getCurrentUTC()),
                    action: "I"
                }]
            };
            break;
        case 1667:
            msgobj = {
                messageBuildNumber: 1668,
                developer: "Shweta",
                message: [{
                    messageKey: "UMID_EXPIRED_ON",
                    category: "MFG",
                    messageType: "Error",
                    messageCode: "MFG20169",
                    message: "Part is expired on: {0}",
                    createdDate: new Date(COMMON.getCurrentUTC()),
                    action: "I"
                }]
            };
            break;
        case 1668:
            msgobj = {
                messageBuildNumber: 1669,
                developer: "Shweta",
                message: [{
                    messageKey: "UMID_RESTRICTED_FROM_UMID",
                    category: "MFG",
                    messageType: "Error",
                    messageCode: "MFG20170",
                    message: "Part restricted to use from UMID level",
                    createdDate: new Date(COMMON.getCurrentUTC()),
                    action: "I"
                }]
            };
            break;
        case 1669:
            msgobj = {
                messageBuildNumber: 1670,
                developer: "Shweta",
                message: [{
                    messageKey: "UMID_RESTRICTED_FROM_PART",
                    category: "MFG",
                    messageType: "Error",
                    messageCode: "MFG20171",
                    message: "Part restricted to use from part master level",
                    createdDate: new Date(COMMON.getCurrentUTC()),
                    action: "I"
                }]
            };
            break;
        case 1670:
            msgobj = {
                messageBuildNumber: 1671,
                developer: "Shweta",
                message: [{
                    messageKey: "UMID_WRONG_LOCATION",
                    category: "MFG",
                    messageType: "Error",
                    messageCode: "MFG20172",
                    message: "UMID valid but wrong location, Please scan different location",
                    createdDate: new Date(COMMON.getCurrentUTC()),
                    action: "I"
                }]
            };
            break;
        case 1671:
            msgobj = {
                messageBuildNumber: 1672,
                developer: "Shweta",
                message: [{
                    messageKey: "UMID_INVALID_OLD_UMID",
                    category: "MFG",
                    messageType: "Error",
                    messageCode: "MFG20173",
                    message: "Old UMID not valid, Please try again with different UMID",
                    createdDate: new Date(COMMON.getCurrentUTC()),
                    action: "I"
                }]
            };
            break;
        case 1672:
            msgobj = {
                messageBuildNumber: 1673,
                developer: "Shweta",
                message: [{
                    messageKey: "UMID_INVALID_BIN",
                    category: "MFG",
                    messageType: "Error",
                    messageCode: "MFG20174",
                    message: "Feeder does not exist, create bin for feeder in bin configuration.",
                    createdDate: new Date(COMMON.getCurrentUTC()),
                    action: "I"
                }]
            };
            break;
        case 1673:
            msgobj = {
                messageBuildNumber: 1674,
                developer: "Shweta",
                message: [{
                    messageKey: "UMID_INVALID_STOCK_TRANSFER",
                    category: "MFG",
                    messageType: "Error",
                    messageCode: "MFG20175",
                    message: "Invalid stock transfer",
                    createdDate: new Date(COMMON.getCurrentUTC()),
                    action: "I"
                }]
            };
            break;
        case 1674:
            msgobj = {
                messageBuildNumber: 1675,
                developer: "Shweta",
                message: [{
                    messageKey: "UMID_NOT_POPULATE_FROM_BOM",
                    category: "MFG",
                    messageType: "Error",
                    messageCode: "MFG20176",
                    message: "Part restricted to install from bill of material level",
                    createdDate: new Date(COMMON.getCurrentUTC()),
                    action: "I"
                }]
            };
            break;
        case 1675:
            msgobj = {
                messageBuildNumber: 1676,
                developer: "Shweta",
                message: [{
                    messageKey: "UMID_RESTRICTED_FROM_PART_WITH_PERMISSION",
                    category: "MFG",
                    messageType: "Error",
                    messageCode: "MFG20177",
                    message: "Part restricted to use with permission from part master level and not approved from bill of material",
                    createdDate: new Date(COMMON.getCurrentUTC()),
                    action: "I"
                }]
            };
            break;
        case 1676:
            msgobj = {
                messageBuildNumber: 1677,
                developer: "Shweta",
                message: [{
                    messageKey: "UMID_RESTRICTED_FROM_PART_PACKAGING",
                    category: "MFG",
                    messageType: "Error",
                    messageCode: "MFG20178",
                    message: "Packaging part restricted to use from part master level",
                    createdDate: new Date(COMMON.getCurrentUTC()),
                    action: "I"
                }]
            };
            break;
        case 1677:
            msgobj = {
                messageBuildNumber: 1678,
                developer: "Shweta",
                message: [{
                    messageKey: "UMID_RESTRICTED_FROM_BOM_DUE_TO_CPN_RESTRICT",
                    category: "MFG",
                    messageType: "Error",
                    messageCode: "MFG20179",
                    message: "Customer part restricted to use from bill of material level",
                    createdDate: new Date(COMMON.getCurrentUTC()),
                    action: "I"
                }]
            };
            break;
        case 1678:
            msgobj = {
                messageBuildNumber: 1679,
                developer: "Shweta",
                message: [{
                    messageKey: "UMID_RESTRICTED_FROM_PART_WITH_PERMISSION_NOT_APPROVED_FROM_BOM",
                    category: "MFG",
                    messageType: "Error",
                    messageCode: "MFG20180",
                    message: "Part restricted to use with permission from part master level and not approved from bill of material",
                    createdDate: new Date(COMMON.getCurrentUTC()),
                    action: "I"
                }]
            };
            break;
        case 1679:
            msgobj = {
                messageBuildNumber: 1680,
                developer: "Shweta",
                message: [{
                    messageKey: "UMID_RESTRICTED_INCORRECT_PART",
                    category: "MFG",
                    messageType: "Error",
                    messageCode: "MFG20181",
                    message: "Part is incorrect or TBD from part master level",
                    createdDate: new Date(COMMON.getCurrentUTC()),
                    action: "I"
                }]
            };
            break;
        case 1680:
            msgobj = {
                messageBuildNumber: 1681,
                developer: "Shweta",
                message: [{
                    messageKey: "UMID_BOM_LINE_INVALID",
                    category: "MFG",
                    messageType: "Error",
                    messageCode: "MFG20182",
                    message: "Bill of material line have still some error, Please clean line first to continue",
                    createdDate: new Date(COMMON.getCurrentUTC()),
                    action: "I"
                }]
            };
            break;
        case 1681:
            msgobj = {
                messageBuildNumber: 1682,
                developer: "Shweta",
                message: [{
                    messageKey: "UMID_INVALID_PART_ROHS_TBD",
                    category: "MFG",
                    messageType: "Error",
                    messageCode: "MFG20183",
                    message: "Part RoHS status is TBD, Please confirm RoHS status of it",
                    createdDate: new Date(COMMON.getCurrentUTC()),
                    action: "I"
                }]
            };
            break;
        case 1682:
            msgobj = {
                messageBuildNumber: 1683,
                developer: "Shweta",
                message: [{
                    messageKey: "UMID_MUST_BE_FROM_PRODUCTION_WAREHOUSE",
                    category: "MFG",
                    messageType: "Error",
                    messageCode: "MFG20184",
                    message: "This material has not been transferred into production warehouse, please first transfer the material to production warehouse",
                    createdDate: new Date(COMMON.getCurrentUTC()),
                    action: "I"
                }]
            };
            break;
        case 1683:
            msgobj = {
                messageBuildNumber: 1684,
                developer: "Shweta",
                message: [{
                    messageKey: "UMID_ASSEMBLY_MUST_HAVE_ROHS_STATUS",
                    category: "MFG",
                    messageType: "Error",
                    messageCode: "MFG20185",
                    message: "Assembly must have RoHS status",
                    createdDate: new Date(COMMON.getCurrentUTC()),
                    action: "I"
                }]
            };
            break;
        case 1684:
            msgobj = {
                messageBuildNumber: 1685,
                developer: "Shweta",
                message: [{
                    messageKey: "UMID_ASSEMBLY_PART_ROHS_MISMATCH",
                    category: "MFG",
                    messageType: "Error",
                    messageCode: "MFG20186",
                    message: "UMID RoHS status mismatched with assembly RoHS status",
                    createdDate: new Date(COMMON.getCurrentUTC()),
                    action: "I"
                }]
            };
            break;
        case 1685:
            msgobj = {
                messageBuildNumber: 1686,
                developer: "Shweta",
                message: [{
                    messageKey: "UMID_ASSEMBLY_CUSTOMER_APPROVAL_REQUIRE_FROM_BOM",
                    category: "MFG",
                    messageType: "Error",
                    messageCode: "MFG20187",
                    message: "UMID RoHS status mismatched with assembly RoHS status, To continue with same part Engg. approval require",
                    createdDate: new Date(COMMON.getCurrentUTC()),
                    action: "I"
                }]
            };
            break;
        case 1686:
            msgobj = {
                messageBuildNumber: 1687,
                developer: "Shweta",
                message: [{
                    messageKey: "UMID_RESTRICTED_FROM_PART_WITH_PERMISSION_USED_IN_WORKORDER",
                    category: "MFG",
                    messageType: "Error",
                    messageCode: "MFG20188",
                    message: "Part restricted to use with permission from part master level and it is used from supplies, materials",
                    createdDate: new Date(COMMON.getCurrentUTC()),
                    action: "I"
                }]
            };
            break;
        case 1687:
            msgobj = {
                messageBuildNumber: 1688,
                developer: "Shweta",
                message: [{
                    messageKey: "UMID_NOT_ENOUGH_STOCK",
                    category: "MFG",
                    messageType: "Error",
                    messageCode: "MFG20189",
                    message: "Scanned UMID stock is lesser than quantity to consume.",
                    createdDate: new Date(COMMON.getCurrentUTC()),
                    action: "I"
                }]
            };
            break;
        case 1688:
            msgobj = {
                messageBuildNumber: 1689,
                developer: "Shweta",
                message: [{
                    messageKey: "UMID_ALREADY_IN_FEDDER",
                    category: "MFG",
                    messageType: "Error",
                    messageCode: "MFG20190",
                    message: "UMID {0} already allocated in feeder.",
                    createdDate: new Date(COMMON.getCurrentUTC()),
                    action: "I"
                }]
            };
            break;
        case 1689:
            msgobj = {
                messageBuildNumber: 1690,
                developer: "Shweta",
                message: [{
                    messageKey: "UMID_MISSING_BOM_PART_ONLY",
                    category: "MFG",
                    messageType: "Error",
                    messageCode: "MFG20191",
                    message: "Only BOM part allowed to scan",
                    createdDate: new Date(COMMON.getCurrentUTC()),
                    action: "I"
                }]
            };
            break;
        case 1690:
            msgobj = {
                messageBuildNumber: 1691,
                developer: "Shweta",
                message: [{
                    messageKey: "UMID_FLUXTYPE_MISMATCH",
                    category: "MFG",
                    messageType: "Error",
                    messageCode: "MFG20192",
                    message: "UMID flux type mismatch with operation activity or assembly flux type.<br/><br/>{0}",
                    createdDate: new Date(COMMON.getCurrentUTC()),
                    action: "I"
                }]
            };
            break;
        case 1691:
            msgobj = {
                messageBuildNumber: 1692,
                developer: "Shweta",
                message: [{
                    messageKey: "UMID_ASSY_FLUXTYPE_INVALID",
                    category: "MFG",
                    messageType: "Error",
                    messageCode: "MFG20193",
                    message: "Assembly flux type is not configured at part master level.<br/><br/>{0}",
                    createdDate: new Date(COMMON.getCurrentUTC()),
                    action: "I"
                }]
            };
            break;
        case 1692:
            msgobj = {
                messageBuildNumber: 1693,
                developer: "Shweta",
                message: [{
                    messageKey: "UMID_FLUXTYPE_INVALID",
                    category: "MFG",
                    messageType: "Error",
                    messageCode: "MFG20194",
                    message: "UMID flux type is not configured at part master level.<br/><br/>{0}",
                    createdDate: new Date(COMMON.getCurrentUTC()),
                    action: "I"
                }]
            };
            break;
        case 1693:
            msgobj = {
                messageBuildNumber: 1694,
                developer: "Shweta",
                message: [{
                    messageKey: "UMID_FROM_EMPTY_BIN_NOT_ALLOWED",
                    category: "MFG",
                    messageType: "Error",
                    messageCode: "MFG20195",
                    message: "UMID is ZERO Out and Moved to Empty Bin.",
                    createdDate: new Date(COMMON.getCurrentUTC()),
                    action: "I"
                }]
            };
            break;
        case 1694:
            msgobj = {
                messageBuildNumber: 1695,
                developer: "Shweta",
                message: [{
                    messageKey: "UMID_VERIFY_UMID_BEFORE_ZEROOUT",
                    category: "MFG",
                    messageType: "Error",
                    messageCode: "MFG20196",
                    message: "Scanned UMID(old) is pending to be verified, please verify the UMID in prior to Zero Out.",
                    createdDate: new Date(COMMON.getCurrentUTC()),
                    action: "I"
                }]
            };
            break;
        case 1695:
            msgobj = {
                messageBuildNumber: 1696,
                developer: "Shweta",
                message: [{
                    messageKey: "UMID_REQUIRED",
                    category: "MFG",
                    messageType: "Warning",
                    messageCode: "MFG30002",
                    message: "Enter UMID",
                    createdDate: new Date(COMMON.getCurrentUTC()),
                    action: "I"
                }]
            };
            break;
        case 1696:
            msgobj = {
                messageBuildNumber: 1697,
                developer: "Shweta",
                message: [{
                    messageKey: "UMID_RESTRICTED_FROM_PART_PACKAGING_WITH_PERMISSION",
                    category: "MFG",
                    messageType: "Confirmation",
                    messageCode: "MFG40060",
                    message: "Are you sure, you want to continue with restricted packaging part (part master level) ?",
                    createdDate: new Date(COMMON.getCurrentUTC()),
                    action: "I"
                }]
            };
            break;
        case 1697:
            msgobj = {
                messageBuildNumber: 1698,
                developer: "Shweta",
                message: [{
                    messageKey: "UMID_RESTRICTED_WITH_PERMISSION_FROM_BOM",
                    category: "MFG",
                    messageType: "Confirmation",
                    messageCode: "MFG40061",
                    message: "Are you sure, you want to continue with restricted part (bill of material level)?",
                    createdDate: new Date(COMMON.getCurrentUTC()),
                    action: "I"
                }]
            };
            break;
        case 1698:
            msgobj = {
                messageBuildNumber: 1699,
                developer: "Shweta",
                message: [{
                    messageKey: "UMID_RESTRICTED_FROM_BOM_DUE_TO_CPN_RESTRICT_WITH_PERMISSION",
                    category: "MFG",
                    messageType: "Confirmation",
                    messageCode: "MFG40062",
                    message: "Are you sure, you want to continue with restricted customer part (bill of material level)?",
                    createdDate: new Date(COMMON.getCurrentUTC()),
                    action: "I"
                }]
            };
            break;
        case 1699:
            msgobj = {
                messageBuildNumber: 1700,
                developer: "Shweta",
                message: [{
                    messageKey: "UMID_CONFIRMATION_FOR_DIFF_LINE_ITEM",
                    category: "MFG",
                    messageType: "Confirmation",
                    messageCode: "MFG40063",
                    message: "UMID is not allocated to this BOM Line, but its allocated in same kit. Are you sure you want to continue?",
                    createdDate: new Date(COMMON.getCurrentUTC()),
                    action: "I"
                }]
            };
            break;
        case 1700:
            msgobj = {
                messageBuildNumber: 1701,
                developer: "Shweta",
                message: [{
                    messageKey: "UMID_CONFIRMATION_ALREADY_SCANNED",
                    category: "MFG",
                    messageType: "Confirmation",
                    messageCode: "MFG40064",
                    message: "Part is already in use for same operation, Are you sure want to continue with same part again?",
                    createdDate: new Date(COMMON.getCurrentUTC()),
                    action: "I"
                }]
            };
            break;
        case 1701:
            msgobj = {
                messageBuildNumber: 1702,
                developer: "Shweta",
                message: [{
                    messageKey: "UMID_CONFIRM_DEALLOCATE_OTHER_KIT",
                    category: "MFG",
                    messageType: "Confirmation",
                    messageCode: "MFG40065",
                    message: "Are you sure to de-allocate UMID from other kits ?",
                    createdDate: new Date(COMMON.getCurrentUTC()),
                    action: "I"
                }]
            };
            break;
        case 1702:
            msgobj = {
                messageBuildNumber: 1703,
                developer: "Shweta",
                message: [{
                    messageKey: "UMID_CONFIRMATION_PART_STATUS_INACTIVE",
                    category: "MFG",
                    messageType: "Confirmation",
                    messageCode: "MFG40066",
                    message: "Part is Inactive (Internal). Are you still want to continue?",
                    createdDate: new Date(COMMON.getCurrentUTC()),
                    action: "I"
                }]
            };
            break;
        case 1703:
            msgobj = {
                messageBuildNumber: 1704,
                developer: "Shweta",
                message: [{
                    messageKey: "FEEDER_ALLOCATED",
                    category: "MFG",
                    messageType: "Information",
                    messageCode: "MFG50063",
                    message: "Feeder already allocated.",
                    createdDate: new Date(COMMON.getCurrentUTC()),
                    action: "I"
                }]
            };
            break;
        case 1704:
            msgobj = {
                messageBuildNumber: 1705,
                developer: "Shweta",
                message: [{
                    messageKey: "FEEDER_ALREADY_VERIFIED",
                    category: "MFG",
                    messageType: "Information",
                    messageCode: "MFG50064",
                    message: "Feeder already verified.",
                    createdDate: new Date(COMMON.getCurrentUTC()),
                    action: "I"
                }]
            };
            break;
        case 1705:
            msgobj = {
                messageBuildNumber: 1706,
                developer: "Shweta",
                message: [{
                    messageKey: "UMID_ALREADY_IN_USE",
                    category: "MFG",
                    messageType: "Information",
                    messageCode: "MFG50065",
                    message: "Part is already in use for same operation",
                    createdDate: new Date(COMMON.getCurrentUTC()),
                    action: "I"
                }]
            };
            break;
        case 1706:
            msgobj = {
                messageBuildNumber: 1707,
                developer: "Shweta",
                message: [{
                    messageKey: "UMID_MISSING_SMT_PART_ONLY",
                    category: "MFG",
                    messageType: "Information",
                    messageCode: "MFG50066",
                    message: "Only Supply, Material & Tool part allowed to scan.",
                    createdDate: new Date(COMMON.getCurrentUTC()),
                    action: "I"
                }]
            };
            break;
        case 1707:
            msgobj = {
                messageBuildNumber: 1708,
                developer: "Champak",
                message: [
                    {
                        messageCode: "MFG40067",
                        messageKey: "SO_CONTAINST_INACTIVE_PART",
                        messageType: "Confirmation",
                        message: "<b>Inactive (Internal)</b> parts will not be duplicated in new SO. Are you sure you want to duplicate <b>SO# {0}</b>?",
                        category: "MFG",
                        modifiedDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 1708:
            msgobj = {
                messageBuildNumber: 1709,
                developer: "Shweta",
                message: [
                    {
                        messageCode: "MFG40068",
                        messageKey: "SHIP_NEARBY_EXPIRE_UMID",
                        messageType: "Confirmation",
                        message: "Selected UMID <b>{0}</b> for shipment will expire on <b>{1}</b>. Are you sure to ship material ? Press Yes to continue.",
                        category: "MFG",
                        modifiedDate: new Date(COMMON.getCurrentUTC()),
                        action: "U"
                    }
                ]
            };
            break;
        case 1709:
            msgobj = {
                messageBuildNumber: 1710,
                developer: "Shweta",
                message: [
                    {
                        messageCode: "MFG40069",
                        messageKey: "SHIP_EXPIRED_UMID",
                        messageType: "Confirmation",
                        message: "Selected UMID <b>{0}</b> for shipment is already expired on <b>{1}</b>. Are you sure to ship material ? Press Yes to continue.",
                        category: "MFG",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 1710:
            msgobj = {
                messageBuildNumber: 1711,
                developer: "Shirish",
                message: [
                    {
                        messageCode: "RFQ40032",
                        messageKey: "CPN_CHANGE_FOR_ALL_BOM_CONFIRAMTION",
                        messageType: "Confirmation",
                        message: "Live BOM change alert! If any changes in CPN alternate part then following assembly of BOM record will be affected. Do you want to continue?",
                        category: "RFQ",
                        modifiedDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 1711:
            msgobj = {
                messageBuildNumber: 1712,
                developer: "Shirish",
                message: [
                    {
                        messageCode: "RFQ40031",
                        messageKey: "MULTI_BOM_ACTIVITY_STOP_FROM_PART_MASTER_MESSAGE",
                        messageType: "Confirmation",
                        message: "BOM Activity will stop for the following assemblies. Are you sure you want to continue?<br/>{0}",
                        category: "RFQ",
                        modifiedDate: new Date(COMMON.getCurrentUTC()),
                        action: "U"
                    }
                ]
            };
            break;
        case 1712:
            msgobj = {
                messageBuildNumber: 1713,
                developer: "Shirish",
                message: [
                    {
                        messageCode: "RFQ40002",
                        messageKey: "BOM_STOP_FROM_RFQ_LIST_MESSAGE",
                        messageType: "Confirmation",
                        message: "BOM activity will stop for the following assembly. Are you sure want to continue?<br/>{0}",
                        category: "RFQ",
                        modifiedDate: new Date(COMMON.getCurrentUTC()),
                        action: "U"
                    }
                ]
            };
            break;
        case 1713:
            msgobj = {
                messageBuildNumber: 1714,
                developer: "Shirish",
                message: [
                    {
                        messageCode: "RFQ20013",
                        messageKey: "VERIFY_SAVE_ERROR_TEXT",
                        messageType: "Error",
                        message: "Some information are still pending to verify. Possible reason is<br/><br/>1. Item(Line#) and QPA must not null.<br/>2. MFR or MPN not added into internal database. Please 'Verify PN Externally'.<br/><br/>Please make sure you have valid and verified Item(Line#), QPA, MFR and MPN information.",
                        category: "RFQ",
                        modifiedDate: new Date(COMMON.getCurrentUTC()),
                        action: "U"
                    }
                ]
            };
            break;
        case 1714:
            msgobj = {
                messageBuildNumber: 1715,
                developer: "Jay",
                message: [
                    {
                        messageCode: "RCV40009",
                        messageKey: "CONFIRMATION_PART_EXIST_WITH_SAME_PACKAGING",
                        messageType: "Confirmation",
                        message: "<b>{0}</b> is already added under the same <b>{1}</b> packaging.<br />a) Press Yes to continue.<br />b) Press No to change Packaging.",
                        category: "RECEIVING",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "U"
                    }
                ]
            };
            break;
        case 1715:
            msgobj = {
                messageBuildNumber: 1716,
                developer: "Jay",
                message: [
                    {
                        messageKey: "CONFIRM_TO_SELECT_PO_LINE",
                        category: "RECEIVING",
                        messageType: "Confirmation",
                        messageCode: "RCV40091",
                        message: "This part <b>{0}</b> is received as part of PO# <b>{1}</b> line as below. Do you want to:<br />a). Select & Merge with PO line from following table?<br />b). Add as another line of PO?<br />",
                        modifiedDate: new Date(COMMON.getCurrentUTC()),
                        action: "U"
                    }
                ]
            };
            break;
        case 1716:
            msgobj = {
                messageBuildNumber: 1717,
                developer: "Jay",
                message: [
                    {
                        messageKey: "BIN_CONTAIN_SAME_PART_WITH_SAME_STATUS",
                        category: "RECEIVING",
                        messageType: "Error",
                        messageCode: "RCV20297",
                        message: "<b>{0}</b> part <b>{1}</b> cannot be with <b>{2}</b> Bin. Transfer the part to different Bin and Continue.<br />Transfer From: {3}<br />Transfer To:",
                        modifiedDate: new Date(COMMON.getCurrentUTC()),
                        action: "U"
                    }
                ]
            };
            break;
        case 1717:
            msgobj = {
                messageBuildNumber: 1718,
                developer: "Jay",
                message: [
                    {
                        messageKey: "BIN_CONTAIN_SAME_PART_WITH_SAME_STATUS_WITHOUT_REQUIREMENT",
                        category: "RECEIVING",
                        messageType: "Error",
                        messageCode: "RCV20300",
                        message: "<b>{0}</b> part <b>{1}</b> cannot be with <b>{2}</b> Bin. Select different Bin and Continue.<br />Transfer From: {3}<br />Transfer To:",
                        modifiedDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 1718:
            msgobj = {
                messageBuildNumber: 1719,
                developer: "Charmi",
                message: [
                    {
                        messageCode: "RCV20301",
                        messageKey: "UMID_COUNT_NOT_MORE_THAN_PENNDING_STOCK",
                        messageType: "Error",
                        message: "UMID Pending Stock {0} of selected line is less than entered UMID Count {1}.",
                        category: "RECEIVING",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 1719:
            msgobj = {
                messageBuildNumber: 1720,
                developer: "Charmi",
                message: [
                    {
                        messageKey: "CONFIRMATION_CONNTINUE_TR_UMID_COUNT",
                        category: "RECEIVING",
                        messageType: "Error",
                        messageCode: "RCV40051",
                        message: "<h2>Mismatch!</h2>{0} of <b>{2}</b> part must be multiple of Part Master UMID SPQ<b>({4})</b> of part <b>{1}</b>.<br><b>A)</b> Press <b>CHANGE {3}</b> to change the {0} to multiple of UMID SPQ.<br><b>B)</b> Press <b>CHANGE PACKAGING</b> to change the Packaging other than {2}.<br><b>C)</b> Press <b>CONTINUE</b> to accept the entered {0} and {2} as a Packaging.",
                        modifiedDate: new Date(COMMON.getCurrentUTC()),
                        action: "U"
                    }
                ]
            };
            break;
        case 1720:
            msgobj = {
                messageBuildNumber: 1721,
                developer: "Ketan",
                message: [
                    {
                        messageKey: "CUST_PAYMENT_ALREADY_UNLOCKED_FOR_UNLOCK",
                        category: "MFG",
                        messageType: "Error",
                        messageCode: "MFG20198",
                        message: "{0} {1} already <b>unlocked</b>. You can not unlock again.",
                        modifiedDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 1721:
            msgobj = {
                messageBuildNumber: 1722,
                developer: "Ketan",
                message: [
                    {
                        messageKey: "CUST_PAYMENT_ALREADY_VOIDED_FOR_LOCK_UNLOCK",
                        category: "MFG",
                        messageType: "Error",
                        messageCode: "MFG20199",
                        message: "{0} {1} already <b>voided</b>. You are not allowed to change.",
                        modifiedDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 1722:
            msgobj = {
                messageBuildNumber: 1723,
                developer: "Ketan",
                message: [
                    {
                        messageKey: "UNLOCK_RECORD_CONFIRMATION",
                        category: "GLOBAL",
                        messageType: "Confirmation",
                        messageCode: "GLB40045",
                        message: "Are you sure you want to unlock selected record(s) ? Press Yes to continue.",
                        modifiedDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 1723:
            msgobj = {
                messageBuildNumber: 1724,
                developer: "Ketan",
                message: [
                    {
                        messageKey: "CUST_PAYMENT_ALREADY_LOCKED_FOR_LOCK",
                        category: "MFG",
                        messageType: "Error",
                        messageCode: "MFG20113",
                        message: "{0} {1} already <b>locked</b>. You can not lock again.",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "U"
                    }
                ]
            };
            break;
        case 1724:
            msgobj = {
                messageBuildNumber: 1725,
                developer: "Ketan",
                message: [
                    {
                        messageKey: "CUST_PAYMENT_PENDING_ADJUSTMENT_AMT_FOR_LOCK",
                        category: "MFG",
                        messageType: "Error",
                        messageCode: "MFG20122",
                        message: "{0} customer payment(s) contain some <b>Remaining Amt. (Incl. Amt. to be Refunded)</b>. You can not lock.",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "U"
                    }
                ]
            };
            break;
        case 1725:
            msgobj = {
                messageBuildNumber: 1726,
                developer: "Ketan",
                message: [
                    {
                        messageKey: "CUST_PAY_LOCKED_WITH_NO_ACCESS",
                        category: "MFG",
                        messageType: "Information",
                        messageCode: "MFG50057",
                        message: "Transaction <b>{0} is locked</b>. Please unlock transaction first or contact to administrator.",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "U"
                    }
                ]
            };
            break;
        case 1726:
            msgobj = {
                messageBuildNumber: 1727,
                developer: "Bhavik",
                message: [
                    {
                        messageKey: "RESET_FIELD_WIDTH_CONFIRM_MESSAGE",
                        category: "MASTER",
                        messageType: "Confirmation",
                        messageCode: "MST40036",
                        message: "Are you sure you want to reset all field's width?",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 1727:
            msgobj = {
                messageBuildNumber: 1728,
                developer: "Bhavik",
                message: [
                    {
                        messageKey: "MIN_VALUE",
                        category: "MASTER",
                        messageType: "Error",
                        messageCode: "MST20076",
                        message: "Not allowed less than {0} {1}.",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 1728:
            msgobj = {
                messageBuildNumber: 1729,
                developer: "Bhavik",
                message: [
                    {
                        messageKey: "SYSTEM_GENERATED_REPORTS_DELETE_NOT_ALLOWED",
                        category: "REPORT",
                        messageType: "Error",
                        messageCode: "RPT20003",
                        message: "System Generated Reports are not allowed to delete.",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 1729:
            msgobj = {
                messageBuildNumber: 1730,
                developer: "Bhavik",
                message: [
                    {
                        messageKey: "OTHER_USERS_REPORT_DELETE_NOT_ALLOWED",
                        category: "REPORT",
                        messageType: "Error",
                        messageCode: "RPT20004",
                        message: "Selected report is created by <b>{0}</b>. You cannot delete.",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 1730:
            msgobj = {
                messageBuildNumber: 1731,
                developer: "Ketan",
                message: [
                    {
                        messageKey: "UNLOCKED_SUCCESSFULLY",
                        category: "GLOBAL",
                        messageType: "Success",
                        messageCode: "GLB10022",
                        message: "{0} unlocked successfully.",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 1731:
            msgobj = {
                messageBuildNumber: 1732,
                developer: "Shirish",
                message: [
                    {
                        messageCode: "RFQ40032",
                        messageKey: "CPN_CHANGE_FOR_ALL_BOM_CONFIRAMTION",
                        messageType: "Confirmation",
                        message: "Live BOM change alert! If any changes in CPN alternate part then following assembly of BOM record will be affected. Do you want to continue?",
                        category: "RFQ",
                        modifiedDate: new Date(COMMON.getCurrentUTC()),
                        action: "U"
                    }
                ]
            };
            break;
        case 1732:
            msgobj = {
                messageBuildNumber: 1733,
                developer: "Shirish",
                message: [
                    {
                        messageCode: "RFQ40031",
                        messageKey: "MULTI_BOM_ACTIVITY_STOP_FROM_PART_MASTER_MESSAGE",
                        messageType: "Confirmation",
                        message: "BOM Activity will stop for the following assemblies. Are you sure you want to continue?<br/>{0}",
                        category: "RFQ",
                        modifiedDate: new Date(COMMON.getCurrentUTC()),
                        action: "U"
                    }
                ]
            };
            break;
        case 1733:
            msgobj = {
                messageBuildNumber: 1734,
                developer: "Shirish",
                message: [
                    {
                        messageCode: "RFQ40002",
                        messageKey: "BOM_STOP_FROM_RFQ_LIST_MESSAGE",
                        messageType: "Confirmation",
                        message: "BOM activity will stop for the following assembly. Are you sure you want to continue?<br/>{0}",
                        category: "RFQ",
                        modifiedDate: new Date(COMMON.getCurrentUTC()),
                        action: "U"
                    }
                ]
            };
            break;
        case 1734:
            msgobj = {
                messageBuildNumber: 1735,
                developer: "Shirish",
                message: [
                    {
                        messageCode: "RFQ20013",
                        messageKey: "VERIFY_SAVE_ERROR_TEXT",
                        messageType: "Error",
                        message: "Some information are still pending to verify. Possible reason is<br/><br/>1. Item(Line#) and QPA must not null.<br/>2. MFR or MPN not added into internal database. Please 'Verify PN Externally'.<br/><br/>Please make sure you have valid and verified Item(Line#), QPA, MFR and MPN information.",
                        category: "RFQ",
                        modifiedDate: new Date(COMMON.getCurrentUTC()),
                        action: "U"
                    }
                ]
            };
            break;
        case 1735:
            msgobj = {
                messageBuildNumber: 1736,
                developer: "Shirish",
                message: [
                    {
                        messageCode: "RFQ20021",
                        messageKey: "DUPLICATE_CPN_EXISTS",
                        messageType: "Error",
                        message: "<h1><b>Duplicate CPN are exists in BOM.</b></h1><br/>Please delete or merge duplicate CPN line before save the BOM changes.<br/><br/><strong> Following duplicate CPN found in BOM.</strong>",
                        category: "RFQ",
                        modifiedDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 1736:
            msgobj = {
                messageBuildNumber: 1737,
                developer: "Shweta",
                message: [{
                    messageKey: "UMID_ALREADY_IN_FEDDER",
                    category: "MFG",
                    messageType: "Error",
                    messageCode: "MFG20190",
                    message: "UMID already allocated in feeder. <br/> {0}",
                    modifiedDate: new Date(COMMON.getCurrentUTC()),
                    action: "U"
                }]
            };
            break;
        case 1737:
            msgobj = {
                messageBuildNumber: 1738,
                developer: "Shweta",
                message: [{
                    messageKey: "INVALID_REF_DES",
                    category: "MFG",
                    messageType: "Error",
                    messageCode: "MFG20202",
                    message: "Invalid REF DES: {0} ! Please check bill of material in prior to add valid REF DES.",
                    createdDate: new Date(COMMON.getCurrentUTC()),
                    action: "I"
                }]
            };
            break;
        case 1738:
            msgobj = {
                messageBuildNumber: 1739,
                developer: "Ketan",
                message: [
                    {
                        messageCode: "MFG20204",
                        messageKey: "INVALIDATED_REASON_FOR_LOCK_CUST_REFUND",
                        messageType: "Error",
                        message: "Action \"Lock Transaction\" is denied for selected record(s) due to any of the following reasons. <br/><b>1. Current status required to be <b>Refunded</b>.<br/>2. All refunded Payment/Credit Memo must be in locked status.</b>",
                        category: "MFG",
                        modifiedDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 1739:
            msgobj = {
                messageBuildNumber: 1740,
                developer: "Bhavik",
                message: [
                    {
                        messageKey: "MIN_VALUE",
                        messageCode: "MST20076",
                        category: "MASTER",
                        deletedDate: new Date(COMMON.getCurrentUTC()),
                        action: "D"
                    }
                ]
            };
            break;
        case 1740:
            msgobj = {
                messageBuildNumber: 1741,
                developer: "Bhavik",
                message: [
                    {
                        messageKey: "MAX_VALUE",
                        category: "GLOBAL",
                        messageType: "Error",
                        messageCode: "GLB20066",
                        message: "Not allowed more than {0} {1}.",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 1741:
            msgobj = {
                messageBuildNumber: 1742,
                developer: "Shirish",
                message: [
                    {
                        messageCode: "RFQ50043",
                        messageKey: "BOM_SPECIFIC_PART_REQUIREMENT_TEXT",
                        messageType: "Information",
                        message: "Current BOM specific part requirements {0} have been changed. Please refresh the BOM to get the updated details.",
                        category: "RFQ",
                        modifiedDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 1742:
            msgobj = {
                messageBuildNumber: 1743,
                developer: "Shirish",
                message: [
                    {
                        messageCode: "RFQ50044",
                        messageKey: "BOM_PART_STANDARD_DETAIL_CHANGE_TEXT",
                        messageType: "Information",
                        message: "Current BOM standard detail have been changed. Please refresh the BOM to get the updated details.",
                        category: "RFQ",
                        modifiedDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 1743:
            msgobj = {
                messageBuildNumber: 1744,
                developer: "Bhavik",
                message: [
                    {
                        messageKey: "MIN_VALUE",
                        category: "GLOBAL",
                        messageType: "Error",
                        messageCode: "GLB20065",
                        message: "Not allowed less than {0} {1}.",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 1744:
            msgobj = {
                messageBuildNumber: 1745,
                developer: "Jay",
                message: [
                    {
                        messageKey: "PURCHASE_ORDER_REMOVE_RESTRICT_PACKING_SLIP",
                        category: "RECEIVING",
                        messageType: "Error",
                        messageCode: "RCV20235",
                        message: "You cannot remove the PO Line ID <b>{0}</b>, Because PO Line is Manual Closed or following packing slip(s) already generated and received the <b>{1}</b> qty against the selected PO Line qty <b>{2}</b>.<br/><br/>Packing slip(s): <b>{3}</b>",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "U"
                    }
                ]
            };
            break;
        case 1745:
            msgobj = {
                messageBuildNumber: 1746,
                developer: "Shirish",
                message: [
                    {
                        messageCode: "RFQ50045",
                        messageKey: "INVALID_CPN_MFRPN_MAPPING",
                        messageType: "Information",
                        message: "Invalid CPN mapping with MPN current BOM.Please Check.<br/><br/><strong> Invalid mapping for following CPN(s): {0}</strong>",
                        category: "RFQ",
                        modifiedDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 1746:
            msgobj = {
                messageBuildNumber: 1747,
                developer: "Shweta",
                message: [
                    {
                        messageKey: "PROD_WO_PATTERN_NOT_ALLOWED_FOR_OTHER_WO_NUM",
                        category: "MFG",
                        messageType: "Information",
                        messageCode: "MFG50061",
                        message: "WO# pattern WOXXXXX-XX not allowed for initial stock as this pattern is used by system generated WO# for Q2C Work Order.<br/>Please change WO# pattern in prior to add initial stock.",
                        modifiedDate: new Date(COMMON.getCurrentUTC()),
                        action: "U"
                    }
                ]
            };
            break;
        case 1747:
            msgobj = {
                messageBuildNumber: 1748,
                developer: "Jay",
                message: [
                    {
                        messageKey: "NOT_ALLOWED_TO_DELETE_CLOSED_PO",
                        category: "RECEIVING",
                        messageType: "Error",
                        messageCode: "RCV20302",
                        message: "You cannot delete the selected record because <b>PO Line Working Status</b> is closed.",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 1748:
            msgobj = {
                messageBuildNumber: 1749,
                developer: "Shirish",
                message: [
                    {
                        messageCode: "RFQ50046",
                        messageKey: "LINE_CPN_INVALID",
                        messageType: "Information",
                        message: "Invalid CPN/Rev into current BOM.Please Check.<br/><br/><strong> Invalid CPN/Rev for following CPN(s): {0}</strong>",
                        category: "RFQ",
                        modifiedDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 1749:
            msgobj = {
                messageBuildNumber: 1750,
                developer: "Ketan",
                message: [
                    {
                        messageCode: "MFG20205",
                        messageKey: "CUST_CM_PENDING_ADJUSTMENT_AMT_FOR_LOCK",
                        messageType: "Error",
                        message: "{0} customer credit memo contain some <b>Remaining Amt. (Incl. Amt. to be Refunded)</b>. You can not lock.",
                        category: "MFG",
                        modifiedDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 1750:
            msgobj = {
                messageBuildNumber: 1751,
                developer: "Shirish",
                message: [
                    {
                        messageCode: "RFQ50047",
                        messageKey: "MOUNTING_FUNCTIONAL_TYPE_MISMATCHED_WITH_APPROVED_TYPE",
                        messageType: "Information",
                        message: "Mounting Type/Funcitnal Type is mismatched with approved mounting type, you not able to select price of this part.",
                        category: "RFQ",
                        modifiedDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 1751:
            msgobj = {
                messageBuildNumber: 1752,
                developer: "Jay",
                message: [
                    {
                        messageKey: "SCAN_CART_IS_NOT_SMART_CART",
                        category: "RECEIVING",
                        messageType: "Error",
                        messageCode: "RCV20303",
                        message: "Scanned <b>{0}</b> warehouse is not Smart Cart.",
                        modifiedDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 1752:
            msgobj = {
                messageBuildNumber: 1753,
                developer: "Jay",
                message: [
                    {
                        messageKey: "SCAN_CART_WITHOUT_SIDE",
                        category: "RECEIVING",
                        messageType: "Error",
                        messageCode: "RCV20304",
                        message: "Please scan warehouse with Smart Cart Side to start the Audit.",
                        modifiedDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 1753:
            msgobj = {
                messageBuildNumber: 1754,
                developer: "Jay",
                message: [
                    {
                        messageKey: "SCAN_CART_IS_NOT_ONLINE",
                        category: "RECEIVING",
                        messageType: "Error",
                        messageCode: "RCV20305",
                        message: "Scanned <b>{0}</b> warehouse is not Online.",
                        modifiedDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 1754:
            msgobj = {
                messageBuildNumber: 1755,
                developer: "Charmi",
                message: [
                    {
                        messageCode: "RCV40097",
                        messageKey: "DEALLOCATION_FOR_LINE_UMID",
                        messageType: "Confirmation",
                        message: "Are you sure you want to deallocate all UMID(s) allocated in line# <b>{0}</b>? Press Yes to Continue.",
                        category: "RECEIVING",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 1755:
            msgobj = {
                messageBuildNumber: 1756,
                developer: "Charmi",
                message: [
                    {
                        messageKey: "KIT_ALLOCATION_CUSTCONSIGN_STATUS",
                        category: "RECEIVING",
                        messageType: "Information",
                        messageCode: "RCV50046",
                        message: "Customer Consigned Status for following line(s) mismatched in BOM and Kit Allocation. Change the status for mismatched line(s) to recalculate Kit allocation details.<br/>Or press Continue to keep the mismatched changes.",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 1756:
            msgobj = {
                messageBuildNumber: 1757,
                developer: "Shweta",
                message: [
                    {
                        messageCode: "MFG20209",
                        messageKey: "REF_DES_LIST_REQUIRED",
                        messageType: "Error",
                        message: "Operation require RefDes list to  perform production activity as it is configured for strictly limited RefDes.",
                        category: "MFG",
                        modifiedDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 1757:
            msgobj = {
                messageBuildNumber: 1758,
                developer: "Shweta",
                message: [
                    {
                        messageCode: "MFG20210",
                        messageKey: "UMID_STRICTY_LIMIT_REFDES_ONLY",
                        messageType: "Error",
                        message: "Entered / Selected RefDes : {0} <br/> Operation configured for strictly limited RefDes with following RefDes: <br/>{1}",
                        category: "MFG",
                        modifiedDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 1758:
            msgobj = {
                messageBuildNumber: 1759,
                developer: "Bhavik",
                message: [
                    {
                        messageKey: "CONFIRMATION_FOR_DELETE_ROLE",
                        messageCode: "MST40010",
                        messageType: "Confirmation",
                        message: "Are you sure you want to update following role details? Press Yes to continue?",
                        category: "MASTER",
                        modifiedDate: new Date(COMMON.getCurrentUTC()),
                        action: "U"
                    }
                ]
            };
            break;
        case 1759:
            msgobj = {
                messageBuildNumber: 1760,
                developer: "Jay",
                message: [
                    {
                        messageKey: "NOT_ALLOW_CHANGE_CUST_CONSIGNED_FIELD",
                        category: "RECEIVING",
                        messageType: "Error",
                        messageCode: "RCV20309",
                        message: "You cannot change the status of <b>Customer consigned (No charge)</b>, Because following packing slip(s) already generated against the <b>PO#</b> {0}.<br/>{1}",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 1760:
            msgobj = {
                messageBuildNumber: 1761,
                developer: "Jay",
                message: [
                    {
                        messageKey: "NOT_ALLOW_CHANGE_NON_UMID_STOCK",
                        category: "RECEIVING",
                        messageType: "Error",
                        messageCode: "RCV20310",
                        message: "You cannot change the status of <b>Customer consigned (No charge)</b>, Because UMID is created against this part",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 1761:
            msgobj = {
                messageBuildNumber: 1762,
                developer: "Jay",
                message: [
                    {
                        messageKey: "NOT_ALLOW_CHANGE_CUST_CONSIGNED_FIELD_RMA_CREATED",
                        category: "RECEIVING",
                        messageType: "Error",
                        messageCode: "RCV20311",
                        message: "You cannot change the status of <b>Customer consigned (No charge)</b>, Because RMA is created against this part",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 1762:
            msgobj = {
                messageBuildNumber: 1763,
                developer: "Jay",
                message: [
                    {
                        messageKey: "PRIOR_TO_SAVE_PACKINGSLIP_DETAILS",
                        category: "RECEIVING",
                        messageType: "Information",
                        messageCode: "RCV50047",
                        message: "In prior to save material details, you must have to save packing slip details.",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 1763:
            msgobj = {
                messageBuildNumber: 1764,
                developer: "Jay",
                message: [
                    {
                        messageKey: "CPN_MISMATCH_WITH_CUSTOMER",
                        category: "RECEIVING",
                        messageType: "Error",
                        messageCode: "RCV20308",
                        message: "CPN <b>{0}</b> is mismatch with Customer Code.",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 1764:
            msgobj = {
                messageBuildNumber: 1765,
                developer: "Shweta",
                message: [
                    {
                        messageCode: "MFG20210",
                        messageKey: "UMID_STRICTY_LIMIT_REFDES_ONLY",
                        messageType: "Error",
                        message: "Entered/Selected RefDes : {0} <br/><br/> Current Operation activity configured as 'Strictly Limited RefDes' with following allowed RefDes: <br/>{1}",
                        category: "MFG",
                        modifiedDate: new Date(COMMON.getCurrentUTC()),
                        action: "U"
                    }
                ]
            };
            break;
        case 1765:
            msgobj = {
                messageBuildNumber: 1766,
                developer: "Shweta",
                message: [{
                    messageKey: "INVALID_REF_DES",
                    category: "MFG",
                    messageType: "Error",
                    messageCode: "MFG20202",
                    message: "Invalid RefDes: {0} ! Please check bill of material in prior to add valid RefDes.",
                    modifiedDate: new Date(COMMON.getCurrentUTC()),
                    action: "U"
                }]
            };
            break;
        case 1766:
            msgobj = {
                messageBuildNumber: 1767,
                developer: "Shweta",
                message: [
                    {
                        messageKey: "DELETE_ALL_REF_DESG_WO_OPERATION",
                        category: "MFG",
                        messageType: "Confirmation",
                        messageCode: "MFG40052",
                        message: "This will remove all entered RefDes Press Yes to continue.",
                        modifiedDate: new Date(COMMON.getCurrentUTC()),
                        action: "U"
                    }
                ]
            };
            break;
        case 1767:
            msgobj = {
                messageBuildNumber: 1768,
                developer: "Shirish",
                message: [
                    {
                        messageCode: "RFQ20009",
                        messageKey: "DUPLICATE_REF_DES_MAPPING_NOT_ALLOWED",
                        messageType: "Error",
                        message: "Diplicate RefDes mapping not allowed. Please apply unique mapping for program RefDes.",
                        category: "RFQ",
                        modifiedDate: new Date(COMMON.getCurrentUTC()),
                        action: "U"
                    }
                ]
            };
            break;
        case 1768:
            msgobj = {
                messageBuildNumber: 1769,
                developer: "Shirish",
                message: [
                    {
                        messageCode: "RFQ20010",
                        messageKey: "LONG_REF_DES_IN_BOM",
                        messageType: "Error",
                        message: "BOM Item# {0} have total {1} RefDes / DNP RefDes, Which is more then configuration RefDes <b>{2}<b/>. <br/>Please verify RefDes / DNP RefDes for same or contact to Administrator.",
                        category: "RFQ",
                        modifiedDate: new Date(COMMON.getCurrentUTC()),
                        action: "U"
                    }
                ]
            };
            break;
        case 1769:
            msgobj = {
                messageBuildNumber: 1770,
                developer: "Charmi",
                message: [
                    {
                        messageCode: "RCV20292",
                        messageKey: "PS_POSTING_STATUS_NOT_ALLOW",
                        messageType: "Error",
                        message: "You cannot create the UMID as packing slip# <b>{0}</b> is in <b>Draft</b> mode for available stock of part <b>{1}</b> with packaging <b>{2}</b> in bin <b>{3}</b>.",
                        category: "RECEIVING",
                        modifiedDate: new Date(COMMON.getCurrentUTC()),
                        action: "U"
                    }
                ]
            };
            break;
        case 1770:
            msgobj = {
                messageBuildNumber: 1771,
                developer: "Charmi",
                message: [
                    {
                        messageKey: "PS_RECEIVED_STATUS_NOT_ALLOW_UMID",
                        category: "RECEIVING",
                        messageType: "Error",
                        messageCode: "RCV20165",
                        message: "You cannot create the UMID as line received status of packing slip# <b>{0}</b> is <b>{1}</b> for available stock of part <b>{2}</b> with packaging <b>{3}</b> in bin <b>{4}</b>.",
                        modifiedDate: new Date(COMMON.getCurrentUTC()),
                        action: "U"
                    }
                ]
            };
            break;
        case 1771:
            msgobj = {
                messageBuildNumber: 1772,
                developer: "Charmi",
                message: [
                    {
                        messageCode: "RCV20184",
                        messageKey: "EXISTING_STOCK_ASSEMBLY_UMID",
                        messageType: "Error",
                        message: "You cannot create UMID for assembly <b>{0}</b> from Non-UMID Stock.",
                        category: "RECEIVING",
                        modifiedDate: new Date(COMMON.getCurrentUTC()),
                        action: "U"
                    }
                ]
            };
            break;
        case 1772:
            msgobj = {
                messageBuildNumber: 1773,
                developer: "Charmi",
                message: [
                    {
                        messageKey: "KIT_ALLOCATION_CUSTCONSIGN_STATUS",
                        category: "RECEIVING",
                        messageType: "Error",
                        messageCode: "RCV20288",
                        message: "Non-UMID Assembly Stock for WO# <b>{0}</b> does not contain in selected Kit <b>{1}</b>. Please select correct Kit.",
                        modifiedDate: new Date(COMMON.getCurrentUTC()),
                        action: "U"
                    }
                ]
            };
            break;
        case 1773:
            msgobj = {
                messageBuildNumber: 1774,
                developer: "Charmi",
                message: [
                    {
                        messageCode: "RCV20307",
                        messageKey: "BIN_PART_PENDING_STOCK_NOT_EXISTS",
                        messageType: "Error",
                        message: "<b>{0}</b> bin does not have pending UMID stock of <b>{1}</b> part or <b>No UMID Stock</b> in packing slip, check with Pending UMID stock once.<br/>Click on Go to Pending UMID Parts to check stock for scanned Part.",
                        category: "RECEIVING",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 1774:
            msgobj = {
                messageBuildNumber: 1775,
                developer: "Charmi",
                message: [
                    {
                        messageKey: "CONFIRMATION_CONNTINUE_TR_NON_UMID_COUNT",
                        category: "RECEIVING",
                        messageType: "Confirmation",
                        messageCode: "RCV40098",
                        message: "<h2>Mismatch!</h2>{0} of <b>{2}</b> part must be multiple of Part Master UMID SPQ<b>({4})</b> of part <b>{1}</b>.<br><b>A)</b> Press <b>CHANGE {3}</b> to change the {0} to multiple of UMID SPQ.<br><b>C)</b> Press <b>CONTINUE</b> to accept the entered {0} and {2} as a Packaging.",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 1775:
            msgobj = {
                messageBuildNumber: 1776,
                developer: "Charmi",
                message: [
                    {
                        messageCode: "RCV20068",
                        messageKey: "NOT_IN_CPN",
                        messageType: "Error",
                        message: "Selected ORG. MPN is not mapped in CPN.",
                        category: "RECEIVING",
                        modifiedDate: new Date(COMMON.getCurrentUTC()),
                        action: "U"
                    }
                ]
            };
            break;
        case 1776:
            msgobj = {
                messageBuildNumber: 1777,
                developer: "Charmi",
                message: [
                    {
                        messageKey: "BIN_NOT_HAVE_STOCK",
                        category: "RECEIVING",
                        messageType: "Error",
                        messageCode: "RCV20057",
                        message: "<b>{0}</b> bin have <b>#binqty#</b> qty of <b>{1}</b> part and you are generating UMID of <b>#creatingqty#</b> qty for <b>{1}</b> part.",
                        modifiedDate: new Date(COMMON.getCurrentUTC()),
                        action: "U"
                    }
                ]
            };
            break;
        case 1777:
            msgobj = {
                messageBuildNumber: 1778,
                developer: "Charmi",
                message: [
                    {
                        messageCode: "RCV20076",
                        messageKey: "REQUIRE_PREFIX",
                        messageType: "Error",
                        message: "UMID Prefix is required.",
                        category: "RECEIVING",
                        modifiedDate: new Date(COMMON.getCurrentUTC()),
                        action: "U"
                    }
                ]
            };
            break;
        case 1778:
            msgobj = {
                messageBuildNumber: 1779,
                developer: "Charmi",
                message: [
                    {
                        messageKey: "KIT_ALLOCATION_CUSTCONSIGN_STATUS",
                        category: "RECEIVING",
                        messageType: "Information",
                        messageCode: "RCV50046",
                        message: "Customer Consigned Status for following line(s) mismatched in BOM and Kit Allocation. Change the status for mismatched line(s) to recalculate Kit allocation details.<br/>Or press Continue to keep the mismatched changes.",
                        modifiedDate: new Date(COMMON.getCurrentUTC()),
                        action: "U"
                    }
                ]
            };
            break;
        case 1779:
            msgobj = {
                messageBuildNumber: 1780,
                developer: "Charmi",
                message: [
                    {
                        messageKey: "NOT_IN_KIT",
                        category: "RECEIVING",
                        messageType: "Error",
                        messageCode: "RCV20288",
                        message: "Non-UMID Assembly Stock for WO# <b>{0}</b> does not contain in selected Kit <b>{1}</b>. Please select correct Kit.",
                        modifiedDate: new Date(COMMON.getCurrentUTC()),
                        action: "U"
                    }
                ]
            };
            break;
        case 1780:
            msgobj = {
                messageBuildNumber: 1781,
                developer: "Shweta",
                message: [
                    {
                        messageCode: "MFG20209",
                        messageKey: "REF_DES_LIST_REQUIRED",
                        messageType: "Error",
                        message: "Operation requires RefDes list to perform production activity as operation is configured as 'Strictly limited RefDes'.",
                        category: "MFG",
                        modifiedDate: new Date(COMMON.getCurrentUTC()),
                        action: "U"
                    }
                ]
            };
            break;
        case 1781:
            msgobj = {
                messageBuildNumber: 1782,
                developer: "Jay",
                message: [
                    {
                        messageCode: "RCV20031",
                        messageKey: "BIN_CONTAIN_SAME_PS_PART",
                        messageType: "Error",
                        message: "Location/Bin <b>{0}</b> containing <b>{1}</b> of PS# <b>{2}</b> for Supplier <b>{3}</b>.<br /> Please select different Location/Bin.",
                        category: "RECEIVING",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "U"
                    }
                ]
            };
            break;
        case 1782:
            msgobj = {
                messageBuildNumber: 1783,
                developer: "Ashish",
                message: [
                    {
                        messageKey: "GENERATE_INSPECTION_REQUIRMENT_REPORT_CONFIRMATION",
                        category: "RECEIVING",
                        messageType: "Confirmation",
                        messageCode: "RCV40099",
                        message: "Are you sure you want to generate report? existing report file will be overwritten if exists. Press Yes to Continue.",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 1783:
            msgobj = {
                messageBuildNumber: 1784,
                developer: "Charmi",
                message: [
                    {
                        messageKey: "REMOVE_UID_PS_STATUS_VALIDATION",
                        category: "RECEIVING",
                        messageType: "Error",
                        messageCode: "RCV20294",
                        message: "Status of supplier packing slip for following UMID(s) is Draft. So you cannot delete UMID(s).",
                        modifiedDate: new Date(COMMON.getCurrentUTC()),
                        action: "U"
                    }
                ]
            };
            break;
        case 1784:
            msgobj = {
                messageBuildNumber: 1785,
                developer: "Charmi",
                message: [
                    {
                        messageKey: "WITHOUT_RESERVE",
                        category: "RECEIVING",
                        messageType: "Error",
                        messageCode: "RCV20083",
                        message: "In selected record some record(s) are not Reserved or Customer Consigned, Please check the selected record.",
                        modifiedDate: new Date(COMMON.getCurrentUTC()),
                        action: "U"
                    }
                ]
            };
            break;
        case 1785:
            msgobj = {
                messageBuildNumber: 1786,
                developer: "Charmi",
                message: [
                    {
                        messageKey: "PS_POSTING_STATUS_NOT_ALLOW",
                        category: "RECEIVING",
                        messageType: "Error",
                        messageCode: "RCV20292",
                        message: "You cannot {0} the {1} as packing slip# <b>{2}</b> is in <b>Draft</b> mode for available stock of part <b>{3}</b> with packaging <b>{4}</b> in bin <b>{5}</b>.",
                        modifiedDate: new Date(COMMON.getCurrentUTC()),
                        action: "U"
                    }
                ]
            };
            break;
        case 1786:
            msgobj = {
                messageBuildNumber: 1787,
                developer: "Bhavik",
                message: [
                    {
                        messageKey: "CHECK_CONFIGURED_APPLICATION",
                        category: "GLOBAL",
                        messageType: "Error",
                        messageCode: "GLB20067",
                        message: "Please check all configured application in Q2C and try again!",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 1787:
            msgobj = {
                messageBuildNumber: 1788,
                developer: "Jay",
                message: [
                    {
                        messageKey: "NOT_ALLOW_CHANGE_CUST_CONSIGNED_FIELD",
                        category: "RECEIVING",
                        messageType: "Error",
                        messageCode: "RCV20309",
                        message: "<b>Customer consigned (No charge)</b> status change is not allowed because the material is already received for the <b>PO#</b> {0}.<br/>{1}",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "U"
                    }
                ]
            };
            break;
        case 1788:
            msgobj = {
                messageBuildNumber: 1789,
                developer: "Ashish",
                message: [
                    {
                        messageKey: "GENERATE_INSPECTION_REQUIRMENT_REPORT_CONFIRMATION",
                        category: "RECEIVING",
                        messageType: "Confirmation",
                        messageCode: "RCV40099",
                        message: "Are you sure you want to Generate Report, existing report will be overwritten if exists? Press Yes to Continue.",
                        modifiedDate: new Date(COMMON.getCurrentUTC()),
                        action: "U"
                    }
                ]
            };
            break;
        case 1789:
            msgobj = {
                messageBuildNumber: 1790,
                developer: "Charmi",
                message: [
                    {
                        messageKey: "BIN_PART_PENDING_STOCK_NOT_EXISTS",
                        category: "RECEIVING",
                        messageType: "Error",
                        messageCode: "RCV20307",
                        message: "<b>{1}</b> does not belong to the bin <b>{0}</b>. Review Pending UMID list should further investigation required.",
                        modifiedDate: new Date(COMMON.getCurrentUTC()),
                        action: "U"
                    }
                ]
            };
            break;
        case 1790:
            msgobj = {
                messageBuildNumber: 1791,
                developer: "Charmi",
                message: [
                    {
                        messageKey: "SPQ_MORE_ALLOW_FOR_CT_CR",
                        category: "RECEIVING",
                        messageType: "Confirmation",
                        messageCode: "RCV40100",
                        message: "Entered count <b>{0}</b> is greater than UMID SPQ <b>{1}</b> of Part <b>{2}</b>. Do you want to change the Count or Continue?",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 1791:
            msgobj = {
                messageBuildNumber: 1792,
                developer: "Jay",
                message: [
                    {
                        messageCode: "RCV40101",
                        messageKey: "ADDING_AS_NON_UMID_STOCK",
                        messageType: "Confirmation",
                        message: "<b>Do Not Create UMID</b> is selected, it will not allow you to create UMID for this material.",
                        category: "RECEIVING",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 1792:
            msgobj = {
                messageBuildNumber: 1793,
                developer: "Jay",
                message: [
                    {
                        messageKey: "NOT_ALLOW_CHANGE_CUST_CONSIGNED_FIELD",
                        category: "RECEIVING",
                        messageType: "Error",
                        messageCode: "RCV20309",
                        message: "<b>{0}</b> status change is not allowed because the material is already received for the <b>PO#</b> {1}.<br/>{2}",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "U"
                    }
                ]
            };
            break;
        case 1793:
            msgobj = {
                messageBuildNumber: 1794,
                developer: "Jay",
                message: [
                    {
                        messageKey: "NOT_ALLOW_CHANGE_CUST_CONSIGNED_FIELD_RMA_CREATED",
                        category: "RECEIVING",
                        messageType: "Error",
                        messageCode: "RCV20311",
                        message: "You cannot change the status of <b>{0}</b>, Because RMA is created against this part",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "U"
                    }
                ]
            };
            break;
        case 1794:
            msgobj = {
                messageBuildNumber: 1795,
                developer: "Jay",
                message: [
                    {
                        messageKey: "BIN_CONTAIN_SAME_PART_WITH_SAME_PACKAGING",
                        category: "RECEIVING",
                        messageType: "Error",
                        messageCode: "RCV20312",
                        message: "<b>{0}</b> already contains same part <b>{1}</b> with same <b>{2}</b> packaging. Select different Bin and Continue.<br />Transfer From: <b>{3}</b><br />Transfer To:",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 1795:
            msgobj = {
                messageBuildNumber: 1796,
                developer: "Champak",
                message: [
                    {
                        messageKey: "BLANKET_PO_CHANGE_STRICT_VALIDATION_ALERT",
                        category: "MFG",
                        messageType: "Information",
                        messageCode: "MFG50067",
                        message: "Made changes of other charges for  Blanket PO# <b>{0}</b>, Will not effect on following future PO#</br><b>{1}</b>.",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 1796:
            msgobj = {
                messageBuildNumber: 1797,
                developer: "Champak",
                message: [
                    {
                        messageKey: "PO_RELEASE_NUMBER_MISMATCH_ERROR",
                        category: "MFG",
                        messageType: "Error",
                        messageCode: "MFG20214",
                        message: "PO Release# <b>{0}</b> not allowed to add as PO Release# <b>{1}</b> is already added in Packing Slip# <b>{2}</b>.<br/>Please select only PO Release# <b>{1}</b> to add in Packing Slip.",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 1797:
            msgobj = {
                messageBuildNumber: 1798,
                developer: "Champak",
                message: [
                    {
                        messageKey: "SO_BLANKET_PO_REMOVE_ALERT",
                        category: "MFG",
                        messageType: "Error",
                        messageCode: "MFG20215",
                        message: "PO Line# <b>{0}</b> of Blanket PO <b>{1}</b> is already mapped with Future PO(s) <b>{2}</b>.<br/>Please first remove PO Line# <b>{0}</b> from Future PO(s).",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 1798:
            msgobj = {
                messageBuildNumber: 1799,
                developer: "Jay",
                message: [
                    {
                        messageCode: "RCV20313",
                        messageKey: "SUPPLIER_TRANSACTION_IS_ALREADY_UNLOCKED",
                        messageType: "Error",
                        message: "You can not unlock record(s). Record(s) are already <b>Unlocked</b>.",
                        category: "RECEIVING",
                        modifiedDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 1799:
            msgobj = {
                messageBuildNumber: 1800,
                developer: "Jay",
                message: [
                    {
                        messageCode: "RCV20315",
                        messageKey: "NOT_ALLOWED_TO_DELETE_PUBLISHED_PO",
                        messageType: "Error",
                        message: "You cannot delete <b>Published</b> purchase order(s).",
                        category: "RECEIVING",
                        modifiedDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 1800:
            msgobj = {
                messageBuildNumber: 1801,
                developer: "Jay",
                message: [
                    {
                        messageCode: "RCV20316",
                        messageKey: "NOT_ALLOWED_TO_OPEN_LOCKED_PO",
                        messageType: "Error",
                        message: "In prior to open purchase order, you must have to unlock the purchase order.",
                        category: "RECEIVING",
                        modifiedDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 1801:
            msgobj = {
                messageBuildNumber: 1802,
                developer: "Jay",
                message: [
                    {
                        messageCode: "RCV20317",
                        messageKey: "RESTRICT_TO_PUBLISH_PS_NOT_HAVING_LINES",
                        messageType: "Error",
                        message: "Add at least single line material details prior to publishing the Packing Slip. Add line details then try again.",
                        category: "RECEIVING",
                        modifiedDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 1802:
            msgobj = {
                messageBuildNumber: 1803,
                developer: "Champak",
                message: [
                    {
                        messageCode: "MFG20216",
                        messageKey: "SALESORDER_UPDATE_RESTRICTED_AFTER_BLANKETPO",
                        messageType: "Error",
                        message: "Changing the SO status from <b>Published</b> to <b>Draft</b> is restricted as Future PO(s) already linked for selected SO# <b>{0}</b>.",
                        category: "MFG",
                        modifiedDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 1803:
            msgobj = {
                messageBuildNumber: 1804,
                developer: "Champak",
                message: [
                    {
                        messageCode: "MFG20217",
                        messageKey: "SALESORDER_REMOVE_BLANKET_PO_ERROR",
                        messageType: "Error",
                        message: "Blanket PO# <b>{0}</b> cannot be clear because, PO Line# <b>{1}</b> is already shipped for customer packing slip(s) <b>{2}</b>.",
                        category: "MFG",
                        modifiedDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 1804:
            msgobj = {
                messageBuildNumber: 1805,
                developer: "Champak",
                message: [
                    {
                        messageCode: "RFQ40033",
                        messageKey: "DELETE_ROW_CONFIRMATION_MESSAGE_RFQ_BOM",
                        messageType: "Confirmation",
                        message: "Are you sure you want to remove following selected Item(s) from BOM? This action cannot be undone once saved. <br/><br/> <b>Item(Line#): </b>{0}.",
                        category: "RFQ",
                        modifiedDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 1805:
            msgobj = {
                messageBuildNumber: 1806,
                developer: "Champak",
                message: [
                    {
                        messageCode: "MFG20220",
                        messageKey: "BLANKET_PO_CANCEL_ALERT",
                        messageType: "Error",
                        message: "PO# <b>{0}</b> cannot canceled because future PO# <b>{1}</b> created against PO# <b>{0}</b>.",
                        category: "MFG",
                        modifiedDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 1806:
            msgobj = {
                messageBuildNumber: 1807,
                developer: "Champak",
                message: [
                    {
                        messageCode: "MFG20221",
                        messageKey: "BLANKET_PO_FUTURE_PO_SET_ALERT",
                        messageType: "Error",
                        message: "PO# <b>{0}</b> cannot be set as Blanket PO because PO Line# <b>{1}</b> already linked with Blanket PO(s).",
                        category: "MFG",
                        modifiedDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 1807:
            msgobj = {
                messageBuildNumber: 1808,
                developer: "Champak",
                message: [
                    {
                        messageCode: "MFG20222",
                        messageKey: "BLANKET_PO_FUTURE_PO_OPTION_SELECT_ALERT",
                        messageType: "Error",
                        message: "<b>Link Blanket PO to Future PO(s)</b> option cannot set in PO# <b>{0}</b> because release line details already added in PO# <b>{0}</b>.",
                        category: "MFG",
                        modifiedDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 1808:
            msgobj = {
                messageBuildNumber: 1809,
                developer: "Jay",
                message: [
                    {
                        messageCode: "RCV40101",
                        messageKey: "ADDING_AS_NON_UMID_STOCK",
                        messageType: "Confirmation",
                        message: "<b>Do Not Create UMID</b> is selected, it will not allow you to create UMID for this PO Line(s).<br/>Do you want to continue?",
                        category: "RECEIVING",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "U"
                    }
                ]
            };
            break;
        case 1809:
            msgobj = {
                messageBuildNumber: 1810,
                developer: "Jay",
                message: [
                    {
                        messageCode: "RCV50041",
                        messageKey: "PO_STATUS_IN_DRAFT_MODE",
                        messageType: "Information",
                        message: "Creating a Packing Slip for <b>Draft</b> PO is prohibited. Please change PO# {0} from <b>Draft</b> to <b>Published</b> to proceed further.",
                        category: "RECEIVING",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "U"
                    }
                ]
            };
            break;
        case 1810:
            msgobj = {
                messageBuildNumber: 1811,
                developer: "Champak",
                message: [
                    {
                        messageCode: "MFG20223",
                        messageKey: "BLANKET_PO_MAPP_REMOVE_ALERT_MSG",
                        messageType: "Error",
                        message: "MPN <b>{0}</b> cannot remove because PO Line# <b>{1}</b> already linked with future PO# <b>{2}</b>.",
                        category: "MFG",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 1811:
            msgobj = {
                messageBuildNumber: 1812,
                developer: "Shubham",
                message: [
                    {
                        messageCode: "PRT20046",
                        messageKey: "ADD_PACKCAGING_PART_LINE",
                        messageType: "Error",
                        message: "Please add at lease 2 part in prior to do Add Packaging Alias.",
                        category: "PARTS",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 1812:
            msgobj = {
                messageBuildNumber: 1813,
                developer: "Shubham",
                message: [
                    {
                        messageCode: "PRT20047",
                        messageKey: "MIS_MATCH_ATTRIBUTE",
                        messageType: "Error",
                        message: "Please check with highlighted attributes for mismatch in prior to add as Packaging Alias.",
                        category: "PARTS",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 1813:
            msgobj = {
                messageBuildNumber: 1814,
                developer: "Shubham",
                message: [
                    {
                        messageCode: "PRT40039",
                        messageKey: "ADD_PACKCAGING_ALIAS_PART_CONFIRMATION",
                        messageType: "Confirmation",
                        message: "Are you sure you want to add  as <b>Packaging Alias Part(s)</b>? <br />It will copy all setting details of part <b>{0}</b> to its packaging alias parts.<br />Press Yes to Continue.",
                        category: "PARTS",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 1814:
            msgobj = {
                messageBuildNumber: 1815,
                developer: "Charmi",
                message: [
                    {
                        messageKey: "INVALID_BIN_OR_SMART_CART",
                        category: "RECEIVING",
                        messageType: "Error",
                        messageCode: "RCV20318",
                        message: "Invalid Scan! Please scan either Bin or Smart Cart only.",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 1815:
            msgobj = {
                messageBuildNumber: 1816,
                developer: "Shubham",
                message: [
                    {
                        messageKey: "RESOURCE_BUSY_LOCK_WAIT_TRANSCATION",
                        category: "GLOBAL",
                        messageType: "Error",
                        messageCode: "GLB20067",
                        message: "Resource is busy! Please try again.",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 1816:
            msgobj = {
                messageBuildNumber: 1817,
                developer: "Jay",
                message: [
                    {
                        messageKey: "BIN_CONTAIN_SAME_PART_WITH_SAME_PACKAGING",
                        category: "RECEIVING",
                        messageType: "Error",
                        messageCode: "RCV20312",
                        message: "<b>{0}</b> already contains same part <b>{1}</b> with same <b>{2}</b> packaging. Select different Bin and Continue.<br />",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "U"
                    }
                ]
            };
            break;
        case 1817:
            msgobj = {
                messageBuildNumber: 1818,
                developer: "Champak",
                message: [
                    {
                        messageKey: "BOM_REMOVE_ALL_BLANK_ITEM_CONFIRM",
                        category: "RFQ",
                        messageType: "Confirmation",
                        messageCode: "RFQ40034",
                        message: "Please check there is some invalid line Items into current BOM. <br/>Press Yes to delete all the blank item(s)<br/><br/><b>Invalid line items(s):</b> {0}.",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 1818:
            msgobj = {
                messageBuildNumber: 1819,
                developer: "Charmi",
                message: [
                    {
                        messageCode: "RFQ10012",
                        messageKey: "BOM_ACTIVITY",
                        messageType: "Success",
                        message: "BOM Activity {0} successfully.",
                        category: "RFQ",
                        modifiedDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 1819:
            msgobj = {
                messageBuildNumber: 1820,
                developer: "Charmi",
                message: [
                    {
                        messageCode: "RFQ10013",
                        messageKey: "BOM_ACTIVITY_AL",
                        messageType: "Success",
                        message: "Already {0} BOM Activity, Please reload page.",
                        category: "RFQ",
                        modifiedDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 1820:
            msgobj = {
                messageBuildNumber: 1821,
                developer: "Shweta",
                message: [
                    {
                        messageKey: "PARENT_DATA_NOT_EXISTS",
                        category: "GLOBAL",
                        messageType: "Error",
                        messageCode: "GLB20068",
                        message: "Parent object does not exists/Missing of edited record.<br/>  Reason: This object could be changed/deleted from different session. Refresh page and check once.",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 1821:
            msgobj = {
                messageBuildNumber: 1822,
                developer: "Shweta",
                message: [
                    {
                        messageCode: "GLB20069",
                        messageKey: "DUPLICATE_ENTRY_WITHOUT_PARAMETER",
                        messageType: "Error",
                        message: "Duplicate Entry!",
                        category: "GLOBAL",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 1822:
            msgobj = {
                messageBuildNumber: 1823,
                developer: "Shweta",
                message: [
                    {
                        messageKey: "PARENT_DATA_NOT_EXISTS",
                        category: "GLOBAL",
                        messageType: "Error",
                        messageCode: "GLB20068",
                        message: "Parent record does not exist or is missing for editing record.<br/>Reason: This record is changed/deleted from a different session. Refresh page and check once.",
                        modifiedDate: new Date(COMMON.getCurrentUTC()),
                        action: "U"
                    }
                ]
            };
            break;
        case 1823:
            msgobj = {
                messageBuildNumber: 1824,
                developer: "Champak",
                message: [
                    {
                        messageKey: "SO_DETAIL_LINE_ALERT_MSG",
                        category: "MFG",
                        messageType: "Error",
                        messageCode: "MFG20225",
                        message: "You cannot remove PO Line# <b>{0}</b> because minimum one line required for <b>Published</b> sales order.",
                        modifiedDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 1824:
            msgobj = {
                messageBuildNumber: 1825,
                developer: "Jay",
                message: [
                    {
                        messageKey: "BIN_CONTAIN_SAME_PART_WITH_SAME_PACKAGING",
                        category: "RECEIVING",
                        messageType: "Error",
                        messageCode: "RCV20312",
                        message: "<b>{0}</b> already contains same part <b>{1}</b> with same <b>{2}</b> packaging. Select different Bin and Continue.<br />Transfer To:",
                        modifiedDate: new Date(COMMON.getCurrentUTC()),
                        action: "U"
                    }
                ]
            };
            break;
        case 1825:
            msgobj = {
                messageBuildNumber: 1826,
                developer: "Bhavik",
                message: [
                    {
                        messageKey: "DEPARTMENT_LOCATION_ADDED",
                        messageCode: "GLB10007",
                        messageType: "Success",
                        message: "Geolocation(s) assigned to {0}.",
                        category: "GLOBAL",
                        modifiedDate: new Date(COMMON.getCurrentUTC()),
                        action: "U"
                    }
                ]
            };
            break;
        case 1826:
            msgobj = {
                messageBuildNumber: 1827,
                developer: "Bhavik",
                message: [{
                    messageKey: "DEPARTMENT_LOCATION_DELETED",
                    messageCode: "GLB10008",
                    messageType: "Success",
                    message: "Geolocation(s) removed from {0}.",
                    category: "GLOBAL",
                    modifiedDate: new Date(COMMON.getCurrentUTC()),
                    action: "U"
                }]
            };
            break;
        case 1827:
            msgobj = {
                messageBuildNumber: 1828,
                developer: "Charmi",
                message: [{
                    messageCode: "RCV20160",
                    messageKey: "SO_COMPLETED_NOT_KIT_ALLOACTE",
                    messageType: "Error",
                    category: "RECEIVING",
                    deletedDate: new Date(COMMON.getCurrentUTC()),
                    action: "D"
                }]
            };
            break;
        case 1828:
            msgobj = {
                messageBuildNumber: 1829,
                developer: "Charmi",
                message: [{
                    messageCode: "RCV20178",
                    messageKey: "SO_CANCELED_NOT_ALLOW_TO_ALLOCATE_KIT",
                    messageType: "Error",
                    category: "RECEIVING",
                    deletedDate: new Date(COMMON.getCurrentUTC()),
                    action: "D"
                }]
            };
            break;
        case 1829:
            msgobj = {
                messageBuildNumber: 1830,
                developer: "Charmi",
                message: [
                    {
                        messageCode: "RCV20160",
                        messageKey: "SO_WORKING_STATUS_NOT_ALLOW_TO_ALLOCATE_KIT",
                        messageType: "Error",
                        message: "This sales order <b>{0}</b> is <b>{1}</b> so you cannot allocate any inventory in this kit.",
                        category: "RECEIVING",
                        modifiedDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 1830:
            msgobj = {
                messageBuildNumber: 1831,
                developer: "Charmi",
                message: [
                    {
                        messageCode: "RCV20314",
                        messageKey: "KIT_ALLOCATION_PO_HALT_ERROR",
                        messageType: "Error",
                        message: "<b>{0}</b> is Halted by on <b>{1}</b>.",
                        category: "RECEIVING",
                        modifiedDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 1831:
            msgobj = {
                messageBuildNumber: 1832,
                developer: "Shweta",
                message: [
                    {
                        messageCode: "MFG20209",
                        messageKey: "REF_DES_LIST_REQUIRED",
                        messageType: "Error",
                        message: "Operation requires RefDes list to perform production activity as operation is configured as 'Allow only RefDes from list when using UMID'.",
                        category: "MFG",
                        modifiedDate: new Date(COMMON.getCurrentUTC()),
                        action: "U"
                    }
                ]
            };
            break;
        case 1832:
            msgobj = {
                messageBuildNumber: 1833,
                developer: "Jay",
                message: [
                    {
                        messageKey: "NOT_ALLOW_CHANGE_NON_UMID_STOCK",
                        category: "RECEIVING",
                        messageType: "Error",
                        messageCode: "RCV20310",
                        message: "You cannot change the status of <b>Customer consigned (No charge)</b>, Because UMID is created against part(s)",
                        modifiedDate: new Date(COMMON.getCurrentUTC()),
                        action: "U"
                    }
                ]
            };
            break;
        case 1833:
            msgobj = {
                messageBuildNumber: 1834,
                developer: "Charmi",
                message: [{
                    messageCode: "RCV50024",
                    messageKey: "INITIATE_KIT_RETURN_WO_STATUS_CHANGE",
                    messageType: "Information",
                    category: "RECEIVING",
                    deletedDate: new Date(COMMON.getCurrentUTC()),
                    action: "D"
                }]
            };
            break;
        case 1834:
            msgobj = {
                messageBuildNumber: 1835,
                developer: "Charmi",
                message: [
                    {
                        messageCode: "RCV20161",
                        messageKey: "KIT_RETURN_WO_STATUS_CHANGE",
                        messageType: "Error",
                        message: "To {1} return request for WO# <b>{0}</b>. The workorder status must be either <b>Completed, Terminated, Completed With Missing Parts or Void.</b>",
                        category: "RECEIVING",
                        modifiedDate: new Date(COMMON.getCurrentUTC()),
                        action: "U"
                    }
                ]
            };
            break;
        case 1835:
            msgobj = {
                messageBuildNumber: 1836,
                developer: "Charmi",
                message: [
                    {
                        messageCode: "RCV20319",
                        messageKey: "SOME_UMID_ALLOCATED",
                        messageType: "Error",
                        message: "From selected UMID(s), some of them are already allocated or allocated by other user to this kit.<br/>Please Refresh the stock once and try again.",
                        category: "RECEIVING",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 1836:
            msgobj = {
                messageBuildNumber: 1837,
                developer: "Charmi",
                message: [
                    {
                        messageCode: "RCV20320",
                        messageKey: "FULLY_KIT_RETUNRED",
                        messageType: "Error",
                        message: "Kit is Fully Returned so you are not allowed to {0}.",
                        category: "RECEIVING",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 1837:
            msgobj = {
                messageBuildNumber: 1838,
                developer: "Charmi",
                message: [
                    {
                        messageCode: "RCV20321",
                        messageKey: "RESERVED_RESTRICTED_UMID",
                        messageType: "Error",
                        message: "From selected some of the UMID(s) Reserved for any Customer or Restricted to use.<br/>Check the selection once in prior allocating in Kit.",
                        category: "RECEIVING",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 1838:
            msgobj = {
                messageBuildNumber: 1839,
                developer: "Charmi",
                message: [
                    {
                        messageCode: "RCV40002",
                        messageKey: "RETURN_KIT_CONFIRM",
                        messageType: "Confirmation",
                        message: "Are you sure you want to {0}?",
                        category: "RECEIVING",
                        modifiedDate: new Date(COMMON.getCurrentUTC()),
                        action: "U"
                    }
                ]
            };
            break;
        case 1839:
            msgobj = {
                messageBuildNumber: 1840,
                developer: "Charmi",
                message: [
                    {
                        messageCode: "RCV20322",
                        messageKey: "INVALID_BIN_OR_SMART_CART",
                        messageType: "Error",
                        message: "Invalid Scan! Please scan either Bin or Smart Cart only.",
                        category: "RECEIVING",
                        modifiedDate: new Date(COMMON.getCurrentUTC()),
                        action: "U"
                    }
                ]
            };
            break;
        case 1840:
            msgobj = {
                messageBuildNumber: 1841,
                developer: "Charmi",
                message: [
                    {
                        messageCode: "RCV40086",
                        messageKey: "MAINTAIN_CURRENT_KIT_PLANNING",
                        messageType: "Confirmation",
                        message: "This will re-release current kit plan <b>#{0}</b>.{1} Are you sure you want to continue?",
                        category: "RECEIVING",
                        modifiedDate: new Date(COMMON.getCurrentUTC()),
                        action: "U"
                    }
                ]
            };
            break;
        case 1841:
            msgobj = {
                messageBuildNumber: 1842,
                developer: "Charmi",
                message: [
                    {
                        messageCode: "RCV40103",
                        messageKey: "SUBSEQUENT_TO_CURRENT_KIT_PLANNING",
                        messageType: "Error",
                        message: "Subsequent kit plan status will change kit released status from Released to Not Released for plan(s) <b>#{1}</b>.",
                        category: "RECEIVING",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 1842:
            msgobj = {
                messageBuildNumber: 1843,
                developer: "Bhavik",
                message: [
                    {
                        messageCode: "MST40037",
                        messageKey: "ONLY_PUBLISHED_OPERATION_CONVERTINTOTEMPLATE",
                        messageType: "Confirmation",
                        message: "Only PUBLISHED operations will be copied to new template. Following <b>DRAFT operations</b> will not be copied to new template. Do you want to continue?",
                        category: "MASTER",
                        modifiedDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 1843:
            msgobj = {
                messageBuildNumber: 1844,
                developer: "Bhavik",
                message: [
                    {
                        messageCode: "MST40038",
                        messageKey: "ALL_OPERATION_CONVERTINTOTEMPLATE",
                        messageType: "Confirmation",
                        message: "All operations from the Current Template will be copied to new template, Do you want to continue?",
                        category: "MASTER",
                        modifiedDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 1844:
            msgobj = {
                messageBuildNumber: 1845,
                developer: "Bhavik",
                message: [
                    {
                        messageCode: "GLB40046",
                        messageKey: "DELETE_CONFIRM_MESSAGE_DET",
                        messageType: "Confirmation",
                        message: "This {0} record will be removed. Press Yes to Continue.",
                        category: "GLOBAL",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 1845:
            msgobj = {
                messageBuildNumber: 1846,
                developer: "Ketan",
                message: [
                    {
                        messageCode: "GLB10023",
                        messageKey: "ITEM_SET_AS_DEFAULT",
                        messageType: "Success",
                        message: "{0} has been set as default.",
                        category: "GLOBAL",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 1846:
            msgobj = {
                messageBuildNumber: 1847,
                developer: "Ketan",
                message: [
                    {
                        messageCode: "MST40039",
                        messageKey: "BILL_SHIP_ADDR_CHANGE_CONFIRM",
                        messageType: "Confirmation",
                        message: "Not recommended. Changes will be applied to historical and open transactions. Do you still want to continue?",
                        category: "MASTER",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 1847:
            msgobj = {
                messageBuildNumber: 1848,
                developer: "Shweta",
                message: [
                    {
                        messageCode: "MFG40073",
                        messageKey: "UPDATE_SHIPPING_METHOD_CONFIRMATION",
                        messageType: "Confirmation",
                        message: "Changing Shipping Method will change <b>Carrirer and Carrier Account#</b>. Are you sure to change Shipping Method ? Press Yes to Continue.",
                        category: "MFG",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 1848:
            msgobj = {
                messageBuildNumber: 1849,
                developer: "Shweta",
                message: [{
                    messageCode: "MFG40029",
                    messageKey: "CUSTOMER_SO_PACKING_SLIP_ADDRESS_SHIPPING_MISMATCH_CONFIRMATION",
                    messageType: "Confirmation",
                    message: "Packing Slip header shipping address/shipping method/carrier is mismatched with release line shipping address/shipping method/carrier. If you want to set release line shipping address/shipping method/carrier as packing slip header, Press \"KEEP LINE ADDRESS\". If you want to keep header shipping address/shipping method as packing slip header, Press \"KEEP HEADER ADDRESS\".",
                    category: "MFG",
                    modifiedDate: new Date(COMMON.getCurrentUTC()),
                    action: "U"
                }]
            };
            break;
        case 1849:
            msgobj = {
                messageBuildNumber: 1850,
                developer: "Shweta",
                message: [{
                    messageCode: "MFG20093",
                    messageKey: "CREATE_NEW_PACKING_SLIP_ON_SHIP_ADDR_MISMATCH",
                    messageType: "Error",
                    message: "Selected release line shipping address/shipping method/carrier is mismatched with packing slip shipping address/shipping method/carrier. Are you sure want to continue?",
                    category: "MFG",
                    createdDate: new Date(COMMON.getCurrentUTC()),
                    action: "U"
                }]
            };
            break;
        case 1850:
            msgobj = {
                messageBuildNumber: 1851,
                developer: "Shweta",
                message: [{
                    messageCode: "GLB40047",
                    messageKey: "DELETE_CONTACT_PERSON_FROM_ADDR",
                    messageType: "Confirmation",
                    message: "Are you sure want to remove <b>Contact Person</b> from {0} address?",
                    category: "GLOBAL",
                    createdDate: new Date(COMMON.getCurrentUTC()),
                    action: "I"
                }]
            };
            break;
        case 1851:
            msgobj = {
                messageBuildNumber: 1852,
                developer: "Champak",
                message: [{
                    messageCode: "MFG40077",
                    messageKey: "SHIPPING_ADDR_CONFIRM_ALERT",
                    messageType: "Confirmation",
                    message: "Sales Order <b>Shipping Method, Carrier and Carrier Account#</b> also will be change. Are you sure to change Shipping Address? Press Yes to Continue.",
                    category: "MFG",
                    createdDate: new Date(COMMON.getCurrentUTC()),
                    action: "I"
                }]
            };
            break;
        case 1852:
            msgobj = {
                messageBuildNumber: 1853,
                developer: "Ketan",
                message: [{
                    messageCode: "MFG20231",
                    messageKey: "CONT_PERSON_REQUIRED_TO_CHG_REFUND_STATUS",
                    messageType: "Error",
                    message: "Please <b>{0} address/contact person</b> details first. After that you can change refund status.",
                    category: "MFG",
                    createdDate: new Date(COMMON.getCurrentUTC()),
                    action: "I"
                }]
            };
            break;
        case 1853:
            msgobj = {
                messageBuildNumber: 1854,
                developer: "Jay",
                message: [
                    {
                        messageKey: "PO_LINE_SHIPPING_ADDRESS_CONFIRMATION",
                        category: "RECEIVING",
                        messageType: "Confirmation",
                        messageCode: "RCV40104",
                        message: "Purchase Order <b>Shipping Method, Carrier and Carrier Account#</b> also will be change. Are you sure to change Shipping Address? Press Yes to Continue.",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 1854:
            msgobj = {
                messageBuildNumber: 1855,
                developer: "Shweta",
                message: [{
                    messageCode: "GLB40047",
                    messageKey: "DELETE_CONTACT_PERSON_FROM_ADDR",
                    messageType: "Confirmation",
                    message: "Are you sure you want to remove <b>Contact Person</b> from {0} address? Press Yes to Continue.",
                    category: "GLOBAL",
                    modifiedDate: new Date(COMMON.getCurrentUTC()),
                    action: "U"
                }]
            };
            break;
        case 1855:
            msgobj = {
                messageBuildNumber: 1856,
                developer: "Shweta",
                message: [{
                    messageCode: "MFG40077",
                    messageKey: "SHIPPING_ADDR_CONFIRM_ALERT",
                    messageType: "Confirmation",
                    message: "{0} <b>Shipping Method, Carrier and Carrier Account#</b> will be changed. Are you sure to change?<ul><li>Press Yes to Continue.</li><li>Press No to change Shipping Address(Incl. Contact Person) only.</li></ui>",
                    category: "MFG",
                    modifiedDate: new Date(COMMON.getCurrentUTC()),
                    action: "U"
                }]
            };
            break;
        case 1856:
            msgobj = {
                messageBuildNumber: 1857,
                developer: "Shweta",
                message: [
                    {
                        messageCode: "MFG40073",
                        messageKey: "UPDATE_SHIPPING_METHOD_CONFIRMATION",
                        messageType: "Confirmation",
                        message: "Changing Shipping Method will change <b>Carrier and Carrier Account#</b>. Are you sure to change Shipping Method ? Press Yes to Continue.",
                        category: "MFG",
                        modifiedDate: new Date(COMMON.getCurrentUTC()),
                        action: "U"
                    }
                ]
            };
            break;
        case 1857:
            msgobj = {
                messageBuildNumber: 1858,
                developer: "Shweta",
                message: [
                    {
                        messageCode: "GLB20070",
                        messageKey: "ADDRESS_CONTACT_PERSON_REQUIRED_FOR_STATUS",
                        messageType: "Error",
                        message: "{0} required. Please add required details first.",
                        category: "GLOBAL",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 1858:
            msgobj = {
                messageBuildNumber: 1859,
                developer: "Champak",
                message: [
                    {
                        messageCode: "MFG20226",
                        messageKey: "LINKTOBPO_ALERT_NOT_MAP_ANYBPO",
                        messageType: "Error",
                        message: "You cannot set <b>Link To Blanket PO</b> option because PO Line#(s) <b>{0}</b> is not linked with Blanket PO.<br/> All PO Line#(s) must be linked with any Blanket PO when this option is selected.",
                        category: "MFG",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "U"
                    }
                ]
            };
            break;
        case 1859:
            msgobj = {
                messageBuildNumber: 1860,
                developer: "Champak",
                message: [
                    {
                        messageCode: "MFG20227",
                        messageKey: "BLANKETPO_NOT_MAPPED_WITH_FPO",
                        messageType: "Error",
                        message: "When <b>Link To Blanket PO</b> option is selected, PO Line# <b>{0}</b> must be linked to a Blanket PO.",
                        category: "MFG",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "U"
                    }
                ]
            };
            break;
        case 1860:
            msgobj = {
                messageBuildNumber: 1861,
                developer: "Champak",
                message: [
                    {
                        messageCode: "MFG40075",
                        messageKey: "UNLINK_REMOVE_CONFIRMATION_ALERT",
                        messageType: "Confirmation",
                        message: "Are you sure you want to unlink PO# <b>{0}</b> from Blanket PO# <b>{1}</b>? Press yes to Continue.",
                        category: "MFG",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "U"
                    }
                ]
            };
            break;
        case 1861:
            msgobj = {
                messageBuildNumber: 1862,
                developer: "Champak",
                message: [
                    {
                        messageCode: "MFG20228",
                        messageKey: "LINKTOBPO_ALERT_NOT_REMOVE",
                        messageType: "Error",
                        message: "You cannot unlink PO# <b>{0}</b> as <b>Link To Blanket PO</b> option selected in the PO.<br/>Uncheck <b>Link To Blanket PO</b> option in PO# <b>{0}</b> if unlink is required.",
                        category: "MFG",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "U"
                    }
                ]
            };
            break;
        case 1862:
            msgobj = {
                messageBuildNumber: 1863,
                developer: "Charmi",
                message: [
                    {
                        messageCode: "RCV40103",
                        messageKey: "SUBSEQUENT_TO_CURRENT_KIT_PLANNING",
                        messageType: "Confirmation",
                        message: "Subsequent kit plan status will change kit released status from Released to Not Released for plan(s) <b>#{0}</b>.",
                        category: "RECEIVING",
                        modifiedDate: new Date(COMMON.getCurrentUTC()),
                        action: "U"
                    }
                ]
            };
            break;
        case 1863:
            msgobj = {
                messageBuildNumber: 1864,
                developer: "Charmi",
                message: [
                    {
                        messageCode: "RCV40033",
                        messageKey: "RERELEASE_KIT",
                        messageType: "Confirmation",
                        message: "No work order is associated to this Kit plan.<br/>Select appropriate option from below to re-release Planned Kit<b>#{0}</b>.",
                        category: "RECEIVING",
                        modifiedDate: new Date(COMMON.getCurrentUTC()),
                        action: "U"
                    }
                ]
            };
            break;
        case 1864:
            msgobj = {
                messageBuildNumber: 1865,
                developer: "Charmi",
                message: [
                    {
                        messageCode: "RCV40087",
                        messageKey: "CHANGE_CURRENT_KIT_PLANNING",
                        messageType: "Confirmation",
                        message: "This will change all planned kit# <b>#{0}</b> from Released to Not Released. Are you sure you want to continue?",
                        category: "RECEIVING",
                        modifiedDate: new Date(COMMON.getCurrentUTC()),
                        action: "U"
                    }
                ]
            };
            break;
        case 1865:
            msgobj = {
                messageBuildNumber: 1866,
                developer: "Charmi",
                message: [
                    {
                        messageCode: "RCV20323",
                        messageKey: "FULLY_KIT_RETUNRED_NOT_ALLOW_ALLOCATION",
                        messageType: "Error",
                        message: "Allocation of any UMID(s) is not allowed to a Fully Returned kit.",
                        category: "RECEIVING",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 1866:
            msgobj = {
                messageBuildNumber: 1867,
                developer: "Bhavik",
                message: [
                    {
                        messageCode: "MST40040",
                        messageKey: "RELEASE_CONT_PERSON",
                        messageType: "Confirmation",
                        message: "Are you sure you want to release <b>{0}</b> contact person. Press Yes to Continue.",
                        category: "MASTER",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 1867:
            msgobj = {
                messageBuildNumber: 1868,
                developer: "Bhavik",
                message: [
                    {
                        messageCode: "MST40041",
                        messageKey: "CONT_PERSON_NOT_ASSIGNED",
                        messageType: "Confirmation",
                        message: "Entered Contact Person is not Assigned yet. Do you want to continue?",
                        category: "MASTER",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 1868:
            msgobj = {
                messageBuildNumber: 1869,
                developer: "Champak",
                message: [
                    {
                        messageCode: "MFG20232",
                        messageKey: "SO_QTY_MORE_VALIDATION",
                        messageType: "Error",
                        message: "You cannot add PO Qty more than selected Blanket PO Qty.",
                        category: "MFG",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 1869:
            msgobj = {
                messageBuildNumber: 1870,
                developer: "Bhavik",
                message: [
                    {
                        messageCode: "MST40042",
                        messageKey: "CONT_PERSON_UPDATE_CONFRIMATION",
                        messageType: "Confirmation",
                        message: "Not recommended.<br />Changes will be applied to historical and open transactions. Do you still want to continue?",
                        category: "MASTER",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 1870:
            msgobj = {
                messageBuildNumber: 1871,
                developer: "Jay",
                message: [
                    {
                        messageKey: "CONFIRM_TO_SELECT_PO_LINE",
                        category: "RECEIVING",
                        messageType: "Confirmation",
                        messageCode: "RCV40091",
                        message: "This part <b>{0}</b> is received as part of PO# <b>{1}</b> line as below. Do you want to:<br />a) Select & Merge with PO line from following table?<br />b) Add as another line of PO?<br />",
                        modifiedDate: new Date(COMMON.getCurrentUTC()),
                        action: "U"
                    }
                ]
            };
            break;
        case 1871:
            msgobj = {
                messageBuildNumber: 1872,
                developer: "Ketan",
                message: [
                    {
                        messageKey: "ADDR_USED_IN_FLOW_COUNTRY_CHG_NOT_ALLOWED",
                        category: "MASTER",
                        messageType: "Error",
                        messageCode: "MST20076",
                        message: "You are not allowed to change country.",
                        modifiedDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 1872:
            msgobj = {
                messageBuildNumber: 1873,
                developer: "Shweta",
                message: [
                    {
                        messageCode: "GLB20071",
                        messageKey: "GLOBAL_NOT_RIGHT_FOR_FEATURE",
                        messageType: "Error",
                        message: "You don't have rights of <b>{0}</b> feature. Please contact to your superior to get rights/access of this feature.",
                        category: "GLOBAL",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 1873:
            msgobj = {
                messageBuildNumber: 1874,
                developer: "Shweta",
                message: [
                    {
                        messageCode: "GLB20072",
                        messageKey: "INACTIVE_CANNOT_SET_DEFAULT",
                        messageType: "Error",
                        message: "To set {0} as default, you need to active it first.",
                        category: "GLOBAL",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 1874:
            msgobj = {
                messageBuildNumber: 1875,
                developer: "Champak",
                message: [
                    {
                        messageCode: "RFQ50048",
                        messageKey: "PLANBOM_SUBMIT_NO_PARTS",
                        messageType: "Error",
                        message: "Attention! BOM contains no part(s) for part costing. Please add part(s) and resubmit BOM.",
                        category: "RFQ",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 1875:
            msgobj = {
                messageBuildNumber: 1876,
                developer: "Shweta",
                message: [
                    {
                        messageKey: "ADDR_USED_IN_FLOW_ACTIVE_CHG_NOT_ALLOWED",
                        category: "MASTER",
                        messageType: "Error",
                        messageCode: "MST20076",
                        message: "You are not allowed to make {0} Inactive.",
                        modifiedDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 1876:
            msgobj = {
                messageBuildNumber: 1877,
                developer: "Bhavik",
                message: [
                    {
                        messageCode: "MST40043",
                        messageKey: "REMOVE_ALL_CONFIRMATION",
                        messageType: "Confirmation",
                        message: "This will remove all entered <b>{0}</b>. Press Yes to continue.",
                        category: "MASTER",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 1877:
            msgobj = {
                messageBuildNumber: 1878,
                developer: "Bhavik",
                message: [
                    {
                        messageCode: "MST40044",
                        messageKey: "OLD_CONT_PERSON_OVERRIDE",
                        messageType: "Confirmation",
                        message: "<b>{0}</b> Contact Person will override <b>{1}</b> Contact Person. Press Yes to continue.",
                        category: "MASTER",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 1878:
            msgobj = {
                messageBuildNumber: 1879,
                developer: "Bhavik",
                message: [
                    {
                        messageCode: "MST40045",
                        messageKey: "OLD_CONT_PERSON_RELEASED",
                        messageType: "Confirmation",
                        message: "<b>{0}</b> Contact Person will be Released. Press Yes to continue.",
                        category: "MASTER",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 1879:
            msgobj = {
                messageBuildNumber: 1880,
                developer: "Bhavik",
                message: [
                    {
                        messageCode: "MST40046",
                        messageKey: "ADDRESS_CONTACT_STATUS_CHANGE",
                        messageType: "Confirmation",
                        message: "{0} status will be changed from {1} to {2}, Press Yes to Continue.",
                        category: "MASTER",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 1880:
            msgobj = {
                messageBuildNumber: 1881,
                developer: "Bhavik",
                message: [
                    {
                        messageKey: "CONT_PERSON_UPDATE_CONFRIMATION",
                        messageCode: "MST40042",
                        messageType: "Confirmation",
                        message: "Not recommended!!!<br />Changes will be applied to all past(closed) and open transactions. Do you still want to continue?",
                        category: "MASTER",
                        modifiedDate: new Date(COMMON.getCurrentUTC()),
                        action: "U"
                    }
                ]
            };
            break;
        case 1881:
            msgobj = {
                messageBuildNumber: 1882,
                developer: "Bhavik",
                message: [
                    {
                        messageKey: "OLD_CONT_PERSON_RELEASED",
                        messageCode: "MST40045",
                        messageType: "Confirmation",
                        message: "<b>{0}</b> contact person will be released once you assign new contact person and saved personnel. Press Yes to continue.",
                        category: "MASTER",
                        modifiedDate: new Date(COMMON.getCurrentUTC()),
                        action: "U"
                    }
                ]
            };
            break;
        case 1882:
            msgobj = {
                messageBuildNumber: 1883,
                developer: "Charmi",
                message: [
                    {
                        messageCode: "RCV20324",
                        messageKey: "STOCK_NOT_EXISTS_FOR_NON_UMID_STOCK",
                        messageType: "Error",
                        message: "You cannot create UMID as packing slip# <b>{0}</b does not have stock. Review Pending UMID list should further investigation required.",
                        category: "RECEIVING",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 1883:
            msgobj = {
                messageBuildNumber: 1884,
                developer: "Charmi",
                message: [
                    {
                        messageCode: "RCV20325",
                        messageKey: "NO_OF_UMID_MORE_THAN_CONFIGURED",
                        messageType: "Error",
                        message: "Maximum UMID to be created with Identical Details is not more than <b>{0}</b>.",
                        category: "RECEIVING",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 1884:
            msgobj = {
                messageBuildNumber: 1885,
                developer: "Charmi",
                message: [
                    {
                        messageCode: "RCV20326",
                        messageKey: "STOCK_NOT_EXISTS_FOR_ASSEMBLY_STOCK",
                        messageType: "Error",
                        message: "You cannot create UMID as the selected Assembly does not have stock.",
                        category: "RECEIVING",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 1885:
            msgobj = {
                messageBuildNumber: 1886,
                developer: "Charmi",
                message: [
                    {
                        messageCode: "RCV20327",
                        messageKey: "SPLIT_UID_NOT_ALLOW",
                        messageType: "Error",
                        message: "Scanned UMID <b>{0}</b> is Split UMID.",
                        category: "RECEIVING",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 1886:
            msgobj = {
                messageBuildNumber: 1887,
                developer: "Charmi",
                message: [
                    {
                        messageCode: "GLB30014",
                        messageKey: "SCAN_MFR_NOT_EXITS",
                        messageType: "Warning",
                        message: "MFR does not exist. Please scan valid MFR.",
                        category: "GLOBAL",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 1887:
            msgobj = {
                messageBuildNumber: 1888,
                developer: "Charmi",
                message: [
                    {
                        messageKey: "FROM_AND_TO_BIN_UMID_CREATION_VALIDATION",
                        category: "RECEIVING",
                        messageType: "Error",
                        messageCode: "RCV20318",
                        message: "<b>To Location/Bin</b> and <b>From Location/Bin</b> must be different, please scan different Bin.",
                        modifiedDate: new Date(COMMON.getCurrentUTC()),
                        action: "U"
                    }
                ]
            };
            break;
        case 1888:
            msgobj = {
                messageBuildNumber: 1889,
                developer: "Charmi",
                message: [
                    {
                        messageCode: "RCV20069",
                        messageKey: "FROM_TO_DEPT_SAME",
                        messageType: "Error",
                        message: "<b>From Location/Bin</b> and <b>To Location/Bin</b> department must be same.",
                        category: "RECEIVING",
                        modifiedDate: new Date(COMMON.getCurrentUTC()),
                        action: "U"
                    }
                ]
            };
            break;
        case 1889:
            msgobj = {
                messageBuildNumber: 1890,
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
        case 1890:
            msgobj = {
                messageBuildNumber: 1891,
                developer: "Champak",
                message: [
                    {
                        messageKey: "COSTING_CLEAR",
                        category: "RFQ",
                        messageType: "Confirmation",
                        messageCode: "RFQ40041",
                        message: "Do you want to clear all pricing data? Press Yes to Continue.",
                        modifiedDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 1891:
            msgobj = {
                messageBuildNumber: 1892,
                developer: "Champak",
                message: [
                    {
                        messageKey: "MATERIAL_COSTING_SUBMIT_CONFIRM",
                        category: "RFQ",
                        messageType: "Confirmation",
                        messageCode: "RFQ40042",
                        message: "Do you want to submit part costing? Press Yes to Continue. <br/><br/> Note: Summary calculation will be change, It will recalculate based on markup %.",
                        modifiedDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 1892:
            msgobj = {
                messageBuildNumber: 1893,
                developer: "Champak",
                message: [
                    {
                        messageKey: "LINENONQUOTEITEM",
                        category: "RFQ",
                        messageType: "Confirmation",
                        messageCode: "RFQ4043",
                        message: "Unselected price line calculate based on current price setting. Press Yes to continue.",
                        modifiedDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 1893:
            msgobj = {
                messageBuildNumber: 1894,
                developer: "Champak",
                message: [
                    {
                        messageKey: "PRICING_DONE",
                        category: "RFQ",
                        messageType: "Information",
                        messageCode: "RFQ50055",
                        message: "Auto pricing has done successfully.",
                        modifiedDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 1894:
            msgobj = {
                messageBuildNumber: 1895,
                developer: "Champak",
                message: [
                    {
                        messageKey: "LINE_ITEM_QUOTE",
                        category: "RFQ",
                        messageType: "Information",
                        messageCode: "RFQ50056",
                        message: "All line item(s) are quoted.",
                        modifiedDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 1895:
            msgobj = {
                messageBuildNumber: 1896,
                developer: "Champak",
                message: [
                    {
                        messageKey: "QUOTE_ALREADY_SUBMIT",
                        category: "RFQ",
                        messageType: "Information",
                        messageCode: "RFQ50057",
                        message: "Quote has been submitted for <b>{0}</b>. So your {1} details will not be save.",
                        modifiedDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 1896:
            msgobj = {
                messageBuildNumber: 1897,
                developer: "Champak",
                message: [
                    {
                        messageKey: "COSTING_PRICE_ALREADY_USE",
                        category: "RFQ",
                        messageType: "Information",
                        messageCode: "RFQ50058",
                        message: "Selected pricing already in use.",
                        modifiedDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 1897:
            msgobj = {
                messageBuildNumber: 1898,
                developer: "Charmi",
                message: [
                    {
                        messageCode: "RCV40093",
                        messageKey: "SHELF_LIFE_DAYS_FOR_MOUNTING_GROUP_CHEMICAL_CONFIRMATION",
                        messageType: "Confirmation",
                        category: "RECEIVING",
                        deletedDate: new Date(COMMON.getCurrentUTC()),
                        action: "D"
                    }
                ]
            };
            break;
        case 1898:
            msgobj = {
                messageBuildNumber: 1899,
                developer: "Charmi",
                message: [{
                    messageCode: "RCV20284",
                    messageKey: "SHELF_LIFE_DAYS_FOR_MOUNTING_GROUP_CHEMICAL_VALIDATION",
                    messageType: "Error",
                    message: "Part mounting type is <b>Chemical</b> and its required shelf life setting. Please update the shelf life setting in part master first then create UMID. For change configuration Press yes to continue.",
                    category: "RECEIVING",
                    modifiedDate: new Date(COMMON.getCurrentUTC()),
                    action: "U"
                }]
            };
            break;
        case 1899:
            msgobj = {
                messageBuildNumber: 1900,
                developer: "Charmi",
                message: [{
                    messageCode: "RCV20057",
                    messageKey: "BIN_NOT_HAVE_STOCK",
                    messageType: "Error",
                    message: "UMID Pending Parts Bin <b>{0}</b> have <b>{2}</b> count of <b>{1}</b>.<br />You are attempting to create UMID of <b>{3}</b> which is not feasible.",
                    category: "RECEIVING",
                    modifiedDate: new Date(COMMON.getCurrentUTC()),
                    action: "U"
                }]
            };
            break;
        case 1900:
            msgobj = {
                messageBuildNumber: 1901,
                developer: "Charmi",
                message: [{
                    messageCode: "RCV20330",
                    messageKey: "IDENTICAL_UMID_STOCK_NOT_EXISTS",
                    messageType: "Error",
                    message: "Change number of UMID to appropriate value to reflect UMID pending Parts Bin count.",
                    category: "RECEIVING",
                    createdDate: new Date(COMMON.getCurrentUTC()),
                    action: "I"
                }]
            };
            break;
        case 1901:
            msgobj = {
                messageBuildNumber: 1902,
                developer: "Charmi",
                message: [{
                    messageCode: "GLB20073",
                    messageKey: "SELECT_VALUE",
                    messageType: "Error",
                    message: "Please select <b>{0}</b>.",
                    category: "GLOBAL",
                    createdDate: new Date(COMMON.getCurrentUTC()),
                    action: "I"
                }]
            };
            break;
        case 1902:
            msgobj = {
                messageBuildNumber: 1903,
                developer: "Jay",
                message: [
                    {
                        messageCode: "RCV20313",
                        messageKey: "SUPPLIER_TRANSACTION_IS_ALREADY_UNLOCKED",
                        messageType: "Error",
                        message: "You cannot unlock record(s). Record(s) are already <b>Unlocked</b>.",
                        category: "RECEIVING",
                        modifiedDate: new Date(COMMON.getCurrentUTC()),
                        action: "U"
                    }
                ]
            };
            break;
        case 1903:
            msgobj = {
                messageBuildNumber: 1904,
                developer: "Jay",
                message: [
                    {
                        messageCode: "RCV20313",
                        messageKey: "PAYMENT_REFUND_TRANSACTION_IS_ALREADY_UNLOCKED",
                        messageType: "Error",
                        message: "You cannot Unlock record(s). From selected some of the record(s) are already <b>Unlocked</b> state.",
                        category: "RECEIVING",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 1904:
            msgobj = {
                messageBuildNumber: 1905,
                developer: "Charmi",
                message: [
                    {
                        messageCode: "RCV20163",
                        messageKey: "INVALIDA_MFR_DATE_CODE",
                        messageType: "Error",
                        category: "RECEIVING",
                        deletedDate: new Date(COMMON.getCurrentUTC()),
                        action: "D"
                    }
                ]
            };
            break;
        case 1905:
            msgobj = {
                messageBuildNumber: 1906,
                developer: "Charmi",
                message: [{
                    messageCode: "RCV20163",
                    messageKey: "INVALID_MFR_DATE_CODE",
                    messageType: "Error",
                    message: "Entered data code or format is incorrect. Verify and enter the correct date code.",
                    category: "RECEIVING",
                    createdDate: new Date(COMMON.getCurrentUTC()),
                    action: "I"
                }]
            };
            break;
        case 1906:
            msgobj = {
                messageBuildNumber: 1907,
                developer: "Charmi",
                message: [{
                    messageCode: "GLB40049",
                    messageKey: "MFR_SUPPLIER_MAPPING_CUSTOM_PART",
                    messageType: "Error",
                    message: "Not recommended!!!<br />Each custom part may have it's own Date Code Format. Setting up a Date Code format at MFR level can upset part level date code format. Do you still want to continue?",
                    category: "GLOBAL",
                    createdDate: new Date(COMMON.getCurrentUTC()),
                    action: "I"
                }]
            };
            break;
        case 1907:
            msgobj = {
                messageBuildNumber: 1908,
                developer: "Charmi",
                message: [{
                    messageCode: "RCV20331",
                    messageKey: "MFR_DATE_CODE_FORMAT_NOT_DEFINED",
                    messageType: "Error",
                    message: "Date Code Format is not defined. Consult supervisor to select proper date code format.",
                    category: "RECEIVING",
                    createdDate: new Date(COMMON.getCurrentUTC()),
                    action: "I"
                }]
            };
            break;
            case 1908:
                msgobj = {
                    messageBuildNumber: 1909,
                    developer: "Jay Solanki",
                    message: [
                        {
                            messageKey: "SELECTROLE_ASSIGN_TO_PAGERIGHT",
                            category: "MASTER",
                            messageType: "Error",
                            messageCode: "MST20078",
                            message: "Please Select Role to assign page rights to Selected User.",
                            modifiedDate: new Date(COMMON.getCurrentUTC()),
                            action: "I"
                        }
                    ]
                };
                break;
            case 1909:
                msgobj = {
                    messageBuildNumber: 1910,
                    developer: "Jay Solanki",
                    message: [
                        {
                            messageKey: "SELECTROLE_ASSIGN_TO_FEATURERIGHT",
                            category: "MASTER",
                            messageType: "Error",
                            messageCode: "MST20079",
                            message: "Please Select Role to assign feature rights to Selected User.",
                            modifiedDate: new Date(COMMON.getCurrentUTC()),
                            action: "I"
                        }
                    ]
                };
                break;
                case 1910:
                    msgobj = {
                        messageBuildNumber: 1911,
                        developer: "Jay Solanki",
                        message: [
                            {
                                messageKey: "PAGE_WILL_BE_REMOVE",
                                category: "MASTER",
                                messageType: "Confirmation",
                                messageCode: "MST40049",
                                message: "Selected Page Permission will be removed. Press Yes to continue.",
                                modifiedDate: new Date(COMMON.getCurrentUTC()),
                                action: "I"
                            }
                        ]
                    };
                    break;
                case 1911:
                    msgobj = {
                        messageBuildNumber: 1912,
                        developer: "Jay Solanki",
                        message: [
                            {
                                messageKey: "FEATURE_WILL_BE_REMOVE",
                                category: "MASTER",
                                messageType: "Confirmation",
                                messageCode: "MST40050",
                                message: "Selected Feature Permission will be removed. Press Yes to continue.",
                                modifiedDate: new Date(COMMON.getCurrentUTC()),
                                action: "I"
                            }
                        ]
                    };
            break;
        case 1912:
            msgobj = {
                messageBuildNumber: 1913,
                developer: "Charmi",
                message: [{
                    messageCode: "RCV20163",
                    messageKey: "INVALID_MFR_DATE_CODE",
                    messageType: "Error",
                    message: "Entered date code or format is incorrect. Verify and enter the correct date code.",
                    category: "RECEIVING",
                    modifiedDate: new Date(COMMON.getCurrentUTC()),
                    action: "U"
                }]
            };
            break;
        case 1913:
            msgobj = {
                messageBuildNumber: 1914,
                developer: "Charmi",
                message: [{
                    messageCode: "GLB20073",
                    messageKey: "SELECT_VALUE",
                    messageType: "Error",
                    message: "Select <b>{0}</b> value in prior to generate <b>{1}</b>.",
                    category: "GLOBAL",
                    modifiedDate: new Date(COMMON.getCurrentUTC()),
                    action: "U"
                }]
            };
            break;
        case 1914:
            msgobj = {
                messageBuildNumber: 1915,
                developer: "Charmi",
                message: [{
                    messageCode: "RCV20333",
                    messageKey: "INTERNAL_DATE_CODE_REQUIRED",
                    messageType: "Error",
                    message: "Set internal date code value in prior to generate UMID.",
                    category: "RECEIVING",
                    createdDate: new Date(COMMON.getCurrentUTC()),
                    action: "I"
                }]
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
//              category: "MFG",
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
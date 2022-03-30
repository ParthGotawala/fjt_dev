(function (newBuild) {
    //var arrMessageBuild =[];
    var msgobj = {};
    switch (newBuild) {
        case 0:
            msgobj = {
                messageBuildNumber: 1,
                developer: "Shweta",
                message: [
                    {
                        messageCode: "GLB50001",
                        messageKey: "DownloadFileErrorMsg_NotFound",
                        messageType: "Information",
                        message: "Document is not found.",
                        category: "GLOBAL",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 1:
            msgobj = {
                messageBuildNumber: 2,
                developer: "Shweta",
                message: [
                    {
                        messageCode: "GLB50002",
                        messageKey: "DownloadFileErrorMsg_AccessDenied",
                        messageType: "Information",
                        message: "Document access is denied. Please contact administrator.",
                        category: "GLOBAL",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 2:
            msgobj = {
                messageBuildNumber: 3,
                developer: "Shweta",
                message: [
                    {
                        messageCode: "GLB50003",
                        messageKey: "DownloadFileErrorMsg_Unauthorized",
                        messageType: "Information",
                        message: "You are not authorized to download document. Please contact administrator.",
                        category: "GLOBAL",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 3:
            msgobj = {
                messageBuildNumber: 4,
                developer: "Shweta",
                message: [
                    {
                        messageCode: "GLB50004",
                        messageKey: "EMP_INACTIVE_ERROR",
                        messageType: "Information",
                        message: "Unable to set login user as inactive.",
                        category: "GLOBAL",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 4:
            msgobj = {
                messageBuildNumber: 5,
                developer: "Shweta",
                message: [
                    {
                        messageCode: "GLB50005",
                        messageKey: "EMP_TRANS_ERROR",
                        messageType: "Information",
                        message: "In prior to inactive personnel, Please complete assigned work order operation activity from traveler page.",
                        category: "GLOBAL",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 5:
            msgobj = {
                messageBuildNumber: 6,
                developer: "Shweta",
                message: [
                    {
                        messageCode: "GLB50006",
                        messageKey: "MINUME_FIVE_MINUTE_REQUIRED",
                        messageType: "Information",
                        message: "Minimum 5 minute required.",
                        category: "GLOBAL",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 6:
            msgobj = {
                messageBuildNumber: 7,
                developer: "Shweta",
                message: [
                    {
                        messageCode: "GLB20001",
                        messageKey: "INVALID_FILE_TYPE",
                        messageType: "Error",
                        message: "Document type is not accepted.",
                        category: "GLOBAL",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 7:
            msgobj = {
                messageBuildNumber: 8,
                developer: "Shweta",
                message: [
                    {
                        messageCode: "GLB40001",
                        messageKey: "WITHOUT_SAVING_ALERT_BODY_MESSAGE",
                        messageType: "Confirmation",
                        message: "You will lose all unsaved work.<br/> Are you sure you want to leave this page?",
                        category: "GLOBAL",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 8:
            msgobj = {
                messageBuildNumber: 9,
                developer: "Shweta",
                message: [
                    {
                        messageCode: "GLB40002",
                        messageKey: "DELETE_CONFIRM_MESSAGE",
                        messageType: "Confirmation",
                        message: "{0} will be removed. Press Yes to Continue.<br>Selected {1} {0} will be removed from list.",
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
                developer: "Shweta",
                message: [
                    {
                        messageCode: "GLB40003",
                        messageKey: "CHANGE_PERSONNEL_PERMISSION_SEND_NOTIFICATION",
                        messageType: "Confirmation",
                        message: "Person is required to re-login in all active sessions. Click on \"Save & Send Notification\" to Save and notify the person.",
                        category: "GLOBAL",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 10:
            msgobj = {
                messageBuildNumber: 11,
                developer: "Shweta",
                message: [
                    {
                        messageCode: "GLB40004",
                        messageKey: "CHANGE_EMP_MESSAGE",
                        messageType: "Confirmation",
                        message: "{0} will be logged out from all other devices. Press Yes to Continue.",
                        category: "GLOBAL",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 11:
            msgobj = {
                messageBuildNumber: 12,
                developer: "Shweta",
                message: [
                    {
                        messageCode: "GLB40005",
                        messageKey: "REMOVE_SINGLE_CONFIRM_MESSAGE",
                        messageType: "Confirmation",
                        message: "Selected {0} details will be removed.{0} will be removed. Press Yes to Continue.",
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
                developer: "Shweta",
                message: [
                    {
                        messageCode: "GLB40006",
                        messageKey: "UNIQUE_CONFIRM_MESSAGE",
                        messageType: "Confirmation",
                        message: "{0} already exists in record! To activate record, please contact to administrator or Press 'Create New' to create new record.",
                        category: "GLOBAL",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 13:
            msgobj = {
                messageBuildNumber: 14,
                developer: "Shweta",
                message: [
                    {
                        messageCode: "GLB30001",
                        messageKey: "MUST_UNIQUE_GLOBAL",
                        messageType: "Warning",
                        message: "{0} must be unique.",
                        category: "GLOBAL",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 14:
            msgobj = {
                messageBuildNumber: 15,
                developer: "Shweta",
                message: [
                    {
                        messageCode: "USR20001",
                        messageKey: "SELECT_ONE",
                        messageType: "Error",
                        message: "Please select at least one {0}.",
                        category: "USER",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 15:
            msgobj = {
                messageBuildNumber: 16,
                developer: "Shweta",
                message: [
                    {
                        messageCode: "GLB50007",
                        messageKey: "PROVIDE_SIGNATURE",
                        messageType: "Information",
                        message: "Please provide a signature first!",
                        category: "GLOBAL",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 16:
            msgobj = {
                messageBuildNumber: 17,
                developer: "Shweta",
                message: [
                    {
                        messageCode: "GLB50008",
                        messageKey: "FILE_TYPE_NOT_ALLOWED",
                        messageType: "Information",
                        message: "Only {0} document type is allowed!",
                        category: "GLOBAL",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 17:
            msgobj = {
                messageBuildNumber: 18,
                developer: "Shweta",
                message: [
                    {
                        messageCode: "GLB50009",
                        messageKey: "CONTACT_TO_ADMIN_LABEL",
                        messageType: "Information",
                        message: "Please contact to administrator.",
                        category: "GLOBAL",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 18:
            msgobj = {
                messageBuildNumber: 19,
                developer: "Shweta",
                message: [
                    {
                        messageCode: "USR40001",
                        messageKey: "SURE_TO_IMPORT_GENERICCATEGRY_FILE",
                        messageType: "Confirmation",
                        message: "Are you sure to import the selected document as {0}? Document details will be imported as {0}.",
                        category: "USER",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 19:
            msgobj = {
                messageBuildNumber: 20,
                developer: "Shweta",
                message: [
                    {
                        messageCode: "EMP50001",
                        messageKey: "EMPEMAIL_UNIQUE",
                        messageType: "Information",
                        message: "Email must be unique.",
                        category: "EMPLOYEE",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 20:
            msgobj = {
                messageBuildNumber: 21,
                developer: "Shweta",
                message: [
                    {
                        messageCode: "EMP50002",
                        messageKey: "EMPCODE_UNIQUE",
                        messageType: "Information",
                        message: "Personnel user id must be unique.",
                        category: "EMPLOYEE",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 21:
            msgobj = {
                messageBuildNumber: 22,
                developer: "Shweta",
                message: [
                    {
                        messageCode: "EMP50003",
                        messageKey: "INITIALNAME_UNIQUE",
                        messageType: "Information",
                        message: "Initial name must be unique.",
                        category: "EMPLOYEE",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 22:
            msgobj = {
                messageBuildNumber: 23,
                developer: "Shweta",
                message: [
                    {
                        messageCode: "GLB50010",
                        messageKey: "NOT_FOUND",
                        messageType: "Information",
                        message: "{0} not found.",
                        category: "GLOBAL",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 23:
            msgobj = {
                messageBuildNumber: 24,
                developer: "Shweta",
                message: [
                    {
                        messageCode: "GLB10001",
                        messageKey: "CREATED",
                        messageType: "Success",
                        message: "{0} created successfully.",
                        category: "GLOBAL",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 24:
            msgobj = {
                messageBuildNumber: 25,
                developer: "Shweta",
                message: [
                    {
                        messageCode: "GLB50011",
                        messageKey: "NOT_CREATED",
                        messageType: "Information",
                        message: "{0} could not be created.",
                        category: "GLOBAL",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
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
                        messageCode: "GLB10002",
                        messageKey: "ADDED",
                        messageType: "Success",
                        message: "{0} added successfully.",
                        category: "GLOBAL",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 26:
            msgobj = {
                messageBuildNumber: 27,
                developer: "Shweta",
                message: [
                    {
                        messageCode: "GLB50012",
                        messageKey: "NOT_ADDED",
                        messageType: "Information",
                        message: "{0} could not be added.",
                        category: "GLOBAL",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 27:
            msgobj = {
                messageBuildNumber: 28,
                developer: "Shweta",
                message: [
                    {
                        messageCode: "GLB10003",
                        messageKey: "UPDATED",
                        messageType: "Success",
                        message: "{0} updated successfully.",
                        category: "GLOBAL",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 28:
            msgobj = {
                messageBuildNumber: 29,
                developer: "Shweta",
                message: [
                    {
                        messageCode: "GLB50009",
                        messageKey: "NOT_UPDATED",
                        messageType: "Information",
                        message: "{0} could not be updated.",
                        category: "GLOBAL",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 29:
            msgobj = {
                messageBuildNumber: 30,
                developer: "Shweta",
                message: [
                    {
                        messageCode: "GLB10004",
                        messageKey: "DELETED",
                        messageType: "Success",
                        message: "{0} deleted successfully.",
                        category: "GLOBAL",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 30:
            msgobj = {
                messageBuildNumber: 31,
                developer: "Shweta",
                message: [
                    {
                        messageCode: "GLB50008",
                        messageKey: "NOT_DELETED",
                        messageType: "Information",
                        message: "{0} could not be deleted.",
                        category: "GLOBAL",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 31:
            msgobj = {
                messageBuildNumber: 32,
                developer: "Shweta",
                message: [
                    {
                        messageCode: "GLB10005",
                        messageKey: "REMOVED",
                        messageType: "Success",
                        message: "{0} removed successfully.",
                        category: "GLOBAL",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 32:
            msgobj = {
                messageBuildNumber: 33,
                developer: "Shweta",
                message: [
                    {
                        messageCode: "GLB50007",
                        messageKey: "NOT_REMOVED",
                        messageType: "Information",
                        message: "{0} could not be removed.",
                        category: "GLOBAL",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;

        case 33:
            msgobj = {
                messageBuildNumber: 34,
                developer: "Shweta",
                message: [
                    {
                        messageCode: "GLB10006",
                        messageKey: "SAVED",
                        messageType: "Success",
                        message: "{0} saved successfully.",
                        category: "GLOBAL",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 34:
            msgobj = {
                messageBuildNumber: 35,
                developer: "Shweta",
                message: [
                    {
                        messageCode: "GLB50005",
                        messageKey: "NOT_SAVED",
                        messageType: "Information",
                        message: "{0} could not be saved.",
                        category: "GLOBAL",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 35:
            msgobj = {
                messageBuildNumber: 36,
                developer: "Shweta",
                message: [
                    {
                        messageCode: "GLB20002",
                        messageKey: "SOMTHING_WRONG",
                        messageType: "Error",
                        message: "Something went wrong. Please contact administrator.",
                        category: "GLOBAL",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 36:
            msgobj = {
                messageBuildNumber: 37,
                developer: "Shweta",
                message: [
                    {
                        messageCode: "EMP50001",
                        messageKey: "OPERATION_OF_EMPLOYEE_NOT_FOUND",
                        messageType: "Information",
                        message: "Operation(s) for personnel are not Found.",
                        category: "EMPLOYEE",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 37:
            msgobj = {
                messageBuildNumber: 38,
                developer: "Shweta",
                message: [
                    {
                        messageCode: "EMP10001",
                        messageKey: "OPERATION_FOR_EMPLOYEE_SAVED",
                        messageType: "Success",
                        message: "Operation(s) are assigned to personnel.",
                        category: "EMPLOYEE",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 38:
            msgobj = {
                messageBuildNumber: 39,
                developer: "Shweta",
                message: [
                    {
                        messageCode: "EMP50002",
                        messageKey: "OPERATION_FOR_EMPLOYEE_NOT_SAVED",
                        messageType: "Information",
                        message: "Operation could not be assigned to personnel.",
                        category: "EMPLOYEE",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 39:
            msgobj = {
                messageBuildNumber: 40,
                developer: "Shweta",
                message: [
                    {
                        messageCode: "GLB20005",
                        messageKey: "INVALID_PARAMETER",
                        messageType: "Error",
                        message: "Invalid parameters",
                        category: "GLOBAL",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 40:
            msgobj = {
                messageBuildNumber: 41,
                developer: "Shweta",
                message: [
                    {
                        messageCode: "GLB20003",
                        messageKey: "DB_DUPLICATE_MESSAGE",
                        messageType: "Error",
                        message: "Duplicate entry not allowed",
                        category: "GLOBAL",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 41:
            msgobj = {
                messageBuildNumber: 42,
                developer: "Shweta",
                message: [
                    {
                        messageCode: "EMP10002",
                        messageKey: "WORKSTATION_ADDED_TO_EMPLOYEE",
                        messageType: "Success",
                        message: "Workstation(s) are assigned to personnel.",
                        category: "EMPLOYEE",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 42:
            msgobj = {
                messageBuildNumber: 43,
                developer: "Shweta",
                message: [
                    {
                        messageCode: "EMP50003",
                        messageKey: "WORKSTATION_NOT_ADDED_TO_EMPLOYEE",
                        messageType: "Information",
                        message: "Workstation could not be assigned to personnel.",
                        category: "EMPLOYEE",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 43:
            msgobj = {
                messageBuildNumber: 44,
                developer: "Shweta",
                message: [
                    {
                        messageCode: "EMP10003",
                        messageKey: "WORKSTATION_DELETED_FROM_EMPLOYEE",
                        messageType: "Success",
                        message: "Workstation(s) are removed from personnel.",
                        category: "EMPLOYEE",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 44:
            msgobj = {
                messageBuildNumber: 45,
                developer: "Shweta",
                message: [
                    {
                        messageCode: "EMP50005",
                        messageKey: "WORKSTATION_NOT_DELETED_FROM_EMPLOYEE",
                        messageType: "Information",
                        message: "Workstation could not be removed from personnel.",
                        category: "EMPLOYEE",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 45:
            msgobj = {
                messageBuildNumber: 46,
                developer: "Shweta",
                message: [
                    {
                        messageCode: "EMP10004",
                        messageKey: "OPERATION_DELETED_FROM_EMPLOYEE",
                        messageType: "Success",
                        message: "Operation(s) are removed from personnel.",
                        category: "EMPLOYEE",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 46:
            msgobj = {
                messageBuildNumber: 47,
                developer: "Shweta",
                message: [
                    {
                        messageCode: "EMP50006",
                        messageKey: "OPERATION_NOT_DELETED_FROM_EMPLOYEE",
                        messageType: "Information",
                        message: "Operation could not be removed from personnel.",
                        category: "EMPLOYEE",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 47:
            msgobj = {
                messageBuildNumber: 48,
                developer: "Shweta",
                message: [
                    {
                        messageCode: "USR50001",
                        messageKey: "OLD_NEW_PASSWORD_DIFFERENT",
                        messageType: "Information",
                        message: "New password must be different from the old password.",
                        category: "USER",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 48:
            msgobj = {
                messageBuildNumber: 49,
                developer: "Shweta",
                message: [
                    {
                        messageCode: "USR10001",
                        messageKey: "PASSWORD_UPDATED",
                        messageType: "Success",
                        message: "Password is reset successfully.",
                        category: "USER",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 49:
            msgobj = {
                messageBuildNumber: 50,
                developer: "Shweta",
                message: [
                    {
                        messageCode: "USR50002",
                        messageKey: "PASSWORD_NOT_UPDATED",
                        messageType: "Information",
                        message: "Password reset is failed.",
                        category: "USER",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 50:
            msgobj = {
                messageBuildNumber: 51,
                developer: "Shweta",
                message: [
                    {
                        messageCode: "USR50003",
                        messageKey: "USER_PASSWORD_INCORRECT",
                        messageType: "Information",
                        message: "Password is incorrect.",
                        category: "USER",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 51:
            msgobj = {
                messageBuildNumber: 52,
                developer: "Shweta",
                message: [
                    {
                        messageCode: "EMP50004",
                        messageKey: "EMPLOYEE_NOT_ADDED",
                        messageType: "Information",
                        message: "Personnel could not be added to department.",
                        category: "EMPLOYEE",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 52:
            msgobj = {
                messageBuildNumber: 53,
                developer: "Shweta",
                message: [
                    {
                        messageCode: "GLB30003",
                        messageKey: "DYNAMIC_MESSAGE_UNIQUE",
                        messageType: "Warning",
                        message: "Message must be unique.",
                        category: "GLOBAL",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 53:
            msgobj = {
                messageBuildNumber: 54,
                developer: "Shweta",
                message: [
                    {
                        messageCode: "GLB30004",
                        messageKey: "DYNAMIC_MESSAGE_UPDATION_ALERT",
                        messageType: "Warning",
                        message: "To get effect of changes, Please re-login for all users.",
                        category: "GLOBAL",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 54:
            msgobj = {
                messageBuildNumber: 55,
                developer: "Shweta",
                message: [
                    {
                        messageCode: "GLB50001",
                        messageKey: "DYNAMIC_MESSAGE_COPY_CLIPBOARD",
                        messageType: "Information",
                        message: "{0} message copied to clipboard.",
                        category: "GLOBAL",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 55:
            msgobj = {
                messageBuildNumber: 56,
                developer: "Shweta",
                message: [
                    {
                        messageCode: "GLB40007",
                        messageKey: "DYNAMIC_MESSAGE_UPDATE_PLACEHOLDER",
                        messageType: "Confirmation",
                        message: "Are your sure, do you want to update system defined placeholder ?",
                        category: "GLOBAL",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 56:
            msgobj = {
                messageBuildNumber: 57,
                developer: "Shweta",
                message: [
                    {
                        messageCode: "GLB20004",
                        messageKey: "DUPLICATE_ENTRY",
                        messageType: "Error",
                        message: "{0}: Duplicate entry!",
                        category: "GLOBAL",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 57:
            msgobj = {
                messageBuildNumber: 58,
                developer: "Shweta",
                message: [
                    {
                        messageCode: "GLB20006",
                        messageKey: "DownloadFileErrorMsg_NotFound",
                        messageType: "Error",
                        message: "Document is not found.",
                        category: "GLOBAL",
                        modifiedDate: new Date(COMMON.getCurrentUTC()),
                        action: "U"
                    }
                ]
            };
            break;
        case 58:
            msgobj = {
                messageBuildNumber: 59,
                developer: "Shweta",
                message: [
                    {
                        messageCode: "GLB30002",
                        messageKey: "EMP_TRANS_ERROR",
                        messageType: "Warning",
                        message: "In prior to inactive personnel, Please complete assigned work order operation activity from traveler page.",
                        category: "GLOBAL",
                        modifiedDate: new Date(COMMON.getCurrentUTC()),
                        action: "U"
                    }
                ]
            };
            break;
        case 59:
            msgobj = {
                messageBuildNumber: 60,
                developer: "Shweta",
                message: [
                    {
                        messageCode: "GLB20007",
                        messageKey: "PROVIDE_SIGNATURE",
                        messageType: "Error",
                        message: "Please provide a signature first!",
                        category: "GLOBAL",
                        modifiedDate: new Date(COMMON.getCurrentUTC()),
                        action: "U"
                    }
                ]
            };
            break;
        case 60:
            msgobj = {
                messageBuildNumber: 61,
                developer: "Shweta",
                message: [
                    {
                        messageCode: "GLB20008",
                        messageKey: "FILE_TYPE_NOT_ALLOWED",
                        messageType: "Error",
                        message: "Only {0} document type is allowed!",
                        category: "GLOBAL",
                        modifiedDate: new Date(COMMON.getCurrentUTC()),
                        action: "U"
                    }
                ]
            };
            break;
        case 61:
            msgobj = {
                messageBuildNumber: 62,
                developer: "Shweta",
                message: [
                    {
                        messageCode: "EMP30001",
                        messageKey: "EMPEMAIL_UNIQUE",
                        messageType: "Warning",
                        message: "Email must be unique.",
                        category: "EMPLOYEE",
                        modifiedDate: new Date(COMMON.getCurrentUTC()),
                        action: "U"
                    }
                ]
            };
            break;
        case 62:
            msgobj = {
                messageBuildNumber: 63,
                developer: "Shweta",
                message: [
                    {
                        messageCode: "EMP30002",
                        messageKey: "EMPCODE_UNIQUE",
                        messageType: "Warning",
                        message: "Personnel user id must be unique.",
                        category: "EMPLOYEE",
                        modifiedDate: new Date(COMMON.getCurrentUTC()),
                        action: "U"
                    }
                ]
            };
            break;
        case 63:
            msgobj = {
                messageBuildNumber: 64,
                developer: "Shweta",
                message: [
                    {
                        messageCode: "EMP30003",
                        messageKey: "INITIALNAME_UNIQUE",
                        messageType: "Warning",
                        message: "Initial name must be unique.",
                        category: "EMPLOYEE",
                        modifiedDate: new Date(COMMON.getCurrentUTC()),
                        action: "U"
                    }
                ]
            };
            break;
        case 64:
            msgobj = {
                messageBuildNumber: 65,
                developer: "Shweta",
                message: [
                    {
                        messageCode: "GLB50009",
                        messageKey: "CONTACT_TO_ADMIN_LABEL",
                        messageType: "Information",
                        category: "GLOBAL",
                        deletedDate: new Date(COMMON.getCurrentUTC()),
                        action: "D"
                    }
                ]
            };
            break;
        case 65:
            msgobj = {
                messageBuildNumber: 66,
                developer: "Shweta",
                message: [
                    {
                        messageCode: "EMP20001",
                        messageKey: "EMPLOYEE_ALREADY_CONTAIN_DEPARTMENT",
                        messageType: "Error",
                        message: "Personnel has already specified department! Please check.",
                        category: "EMPLOYEE",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 66:
            msgobj = {
                messageBuildNumber: 67,
                developer: "Shweta",
                message: [
                    {
                        messageCode: "EMP10005",
                        messageKey: "EMPLOYEE_IN_DEPARTMENT_ADDED",
                        messageType: "Success",
                        message: "Personnel is added to department successfully.",
                        category: "EMPLOYEE",
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
                        messageCode: "EMP10006",
                        messageKey: "DEPARTMENT_UPDATED_AS_DEFAULT",
                        messageType: "Success",
                        message: "Department is set as default for personnel.",
                        category: "EMPLOYEE",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
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
                        messageCode: "GLB30005",
                        messageKey: "DELETE_ALERT_USED_MESSAGE",
                        messageType: "Warning",
                        message: "Selected {0}(s) are in used.",
                        category: "GLOBAL",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 69:
            msgobj = {
                messageBuildNumber: 70,
                developer: "Shweta",
                message: [
                    {
                        messageCode: "GLB30006",
                        messageKey: "DELETE_ALERT_USED_MESSAGE_WITH_TRANSACTION_COUNT",
                        messageType: "Warning",
                        message: "Selected {0}(s) are in used. {1} to check transaction({2}) list.",
                        category: "GLOBAL",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 70:
            msgobj = {
                messageBuildNumber: 71,
                developer: "Shweta",
                message: [
                    {
                        messageCode: "GLB10007",
                        messageKey: "DEPARTMENT_LOCATION_ADDED",
                        messageType: "Success",
                        message: "Location(s) assigned to {0}.",
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
                developer: "Shweta",
                message: [
                    {
                        messageCode: "GLB10008",
                        messageKey: "DEPARTMENT_LOCATION_DELETED",
                        messageType: "Success",
                        message: "Location(s) removed from {0}.",
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
                developer: "Shweta",
                message: [
                    {
                        messageCode: "GLB40008",
                        messageKey: "MFG_ALIAS_NOT_ADDED",
                        messageType: "Confirmation",
                        message: "Entered alias is not added yet. Do you want to continue?",
                        category: "GLOBAL",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 73:
            msgobj = {
                messageBuildNumber: 74,
                developer: "Shweta",
                message: [
                    {
                        messageCode: "GLB30007",
                        messageKey: "MFG_ALIAS_EXISTS",
                        messageType: "Warning",
                        message: "<b>{0}</b> alias name already exists in {1} <b>{2}</b>.",
                        category: "GLOBAL",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 74:
            msgobj = {
                messageBuildNumber: 75,
                developer: "Shweta",
                message: [
                    {
                        messageCode: "GLB30008",
                        messageKey: "ALIAS_EXISTS_GLOBAL",
                        messageType: "Warning",
                        message: "Alias name already exists",
                        category: "GLOBAL",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 75:
            msgobj = {
                messageBuildNumber: 76,
                developer: "Shweta",
                message: [
                    {
                        messageCode: "GLB50013",
                        messageKey: "SET_ALIAS_AS_DEFAULT_NAME",
                        messageType: "Information",
                        message: "Selected \"{0}\" alias will be set as {1} name.",
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
                developer: "Shweta",
                message: [
                    {
                        messageCode: "MST40001",
                        messageKey: "ADD_ALTERNATE_PART_CPN_CONFIRMATION",
                        messageType: "Confirmation",
                        message: "Are you sure you want to add <b>{0}</b> as an <b>AVL</b> with CPN? Press Yes to Continue.",
                        category: "MASTER",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;

        case 77:
            msgobj = {
                messageBuildNumber: 78,
                developer: "Shweta",
                message: [
                    {
                        messageCode: "MST40002",
                        messageKey: "ADD_ALTERNATE_PART_CONFIRMATION_BOM_BODY_MESSAGE",
                        messageType: "Confirmation",
                        message: "Are you sure you want to change following(s) assembly <b>{0}</b> because this CPN is used in this? Press Yes to Continue.",
                        category: "MASTER",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 78:
            msgobj = {
                messageBuildNumber: 79,
                developer: "Shweta",
                message: [
                    {
                        messageCode: "GLB20009",
                        messageKey: "IMPORT_EXCEL_DATA_VALIDATION",
                        messageType: "Error",
                        message: "{0} Detail required for mapping.<br/>Please review {0} detail and correct it and try again",
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
                developer: "Shweta",
                message: [
                    {
                        messageCode: "RFQ20001",
                        messageKey: "BOM_UPLOAD_FAIL",
                        messageType: "Error",
                        message: "BOM Upload Failed.",
                        category: "RFQ",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 80:
            msgobj = {
                messageBuildNumber: 81,
                developer: "Shweta",
                message: [
                    {
                        messageCode: "GLB20011",
                        messageKey: "SINGLE_FILE_UPLOAD",
                        messageType: "Error",
                        message: "Please upload any single document.",
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
                developer: "Shweta",
                message: [
                    {
                        messageCode: "RFQ20002",
                        messageKey: "BOM_UPLOAD_FAIL_SIZE_TEXT",
                        messageType: "Error",
                        message: "Document is too large.",
                        category: "RFQ",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 82:
            msgobj = {
                messageBuildNumber: 83,
                developer: "Shweta",
                message: [
                    {
                        messageCode: "EMP30003",
                        messageKey: "INITIALNAME_UNIQUE",
                        category: "EMPLOYEE",
                        deletedDate: new Date(COMMON.getCurrentUTC()),
                        action: "D"
                    }
                ]
            };
            break;
        case 83:
            msgobj = {
                messageBuildNumber: 84,
                developer: "Shweta",
                message: [
                    {
                        messageCode: "EMP30002",
                        messageKey: "EMPCODE_UNIQUE",
                        category: "EMPLOYEE",
                        deletedDate: new Date(COMMON.getCurrentUTC()),
                        action: "D"
                    }
                ]
            };
            break;
        case 84:
            msgobj = {
                messageBuildNumber: 85,
                developer: "Shweta",
                message: [
                    {
                        messageCode: "EMP30001",
                        messageKey: "EMPEMAIL_UNIQUE",
                        category: "EMPLOYEE",
                        deletedDate: new Date(COMMON.getCurrentUTC()),
                        action: "D"
                    }
                ]
            };
            break;
        case 85:
            msgobj = {
                messageBuildNumber: 86,
                developer: "Shweta",
                message: [
                    {
                        messageCode: "GLB30003",
                        messageKey: "DYNAMIC_MESSAGE_UNIQUE",
                        category: "GLOBAL",
                        deletedDate: new Date(COMMON.getCurrentUTC()),
                        action: "D"
                    }
                ]
            };
            break;
        case 86:
            msgobj = {
                messageBuildNumber: 87,
                developer: "Shweta",
                message: [
                    {
                        messageCode: "EMP50001",
                        messageKey: "OPERATION_OF_EMPLOYEE_NOT_FOUND",
                        category: "EMPLOYEE",
                        deletedDate: new Date(COMMON.getCurrentUTC()),
                        action: "D"
                    }
                ]
            };
            break;
        case 87:
            msgobj = {
                messageBuildNumber: 88,
                developer: "Shweta",
                message: [
                    {
                        messageCode: "EMP10001",
                        messageKey: "OPERATION_FOR_EMPLOYEE_SAVED",
                        category: "EMPLOYEE",
                        deletedDate: new Date(COMMON.getCurrentUTC()),
                        action: "D"
                    }
                ]
            };
            break;
        case 88:
            msgobj = {
                messageBuildNumber: 89,
                developer: "Shweta",
                message: [
                    {
                        messageCode: "EMP50002",
                        messageKey: "OPERATION_FOR_EMPLOYEE_NOT_SAVED",
                        category: "EMPLOYEE",
                        deletedDate: new Date(COMMON.getCurrentUTC()),
                        action: "D"
                    }
                ]
            };
            break;
        case 89:
            msgobj = {
                messageBuildNumber: 90,
                developer: "Shweta",
                message: [
                    {
                        messageCode: "EMP10002",
                        messageKey: "WORKSTATION_ADDED_TO_EMPLOYEE",
                        category: "EMPLOYEE",
                        deletedDate: new Date(COMMON.getCurrentUTC()),
                        action: "D"
                    }
                ]
            };
            break;
        case 90:
            msgobj = {
                messageBuildNumber: 90,
                developer: "Shweta",
                message: [
                    {
                        messageCode: "EMP50003",
                        messageKey: "WORKSTATION_NOT_ADDED_TO_EMPLOYEE",
                        category: "EMPLOYEE",
                        deletedDate: new Date(COMMON.getCurrentUTC()),
                        action: "D"
                    }
                ]
            };
            break;
        case 91:
            msgobj = {
                messageBuildNumber: 91,
                developer: "Shweta",
                message: [
                    {
                        messageCode: "EMP10003",
                        messageKey: "WORKSTATION_DELETED_FROM_EMPLOYEE",
                        category: "EMPLOYEE",
                        deletedDate: new Date(COMMON.getCurrentUTC()),
                        action: "D"
                    }
                ]
            };
            break;
        case 92:
            msgobj = {
                messageBuildNumber: 93,
                developer: "Shweta",
                message: [
                    {
                        messageCode: "EMP50005",
                        messageKey: "WORKSTATION_NOT_DELETED_FROM_EMPLOYEE",
                        category: "EMPLOYEE",
                        deletedDate: new Date(COMMON.getCurrentUTC()),
                        action: "D"
                    }
                ]
            };
            break;
        case 93:
            msgobj = {
                messageBuildNumber: 94,
                developer: "Shweta",
                message: [
                    {
                        messageCode: "EMP10004",
                        messageKey: "OPERATION_DELETED_FROM_EMPLOYEE",
                        category: "EMPLOYEE",
                        deletedDate: new Date(COMMON.getCurrentUTC()),
                        action: "D"
                    }
                ]
            };
            break;
        case 94:
            msgobj = {
                messageBuildNumber: 95,
                developer: "Shweta",
                message: [
                    {
                        messageCode: "EMP50006",
                        messageKey: "OPERATION_NOT_DELETED_FROM_EMPLOYEE",
                        category: "EMPLOYEE",
                        deletedDate: new Date(COMMON.getCurrentUTC()),
                        action: "D"
                    }
                ]
            };
            break;
        case 95:
            msgobj = {
                messageBuildNumber: 96,
                developer: "Shweta",
                message: [
                    {
                        messageCode: "EMP50004",
                        messageKey: "EMPLOYEE_NOT_ADDED",
                        category: "EMPLOYEE",
                        deletedDate: new Date(COMMON.getCurrentUTC()),
                        action: "D"
                    }
                ]
            };
            break;
        case 96:
            msgobj = {
                messageBuildNumber: 97,
                developer: "Shweta",
                message: [
                    {
                        messageCode: "EMP20001",
                        messageKey: "EMPLOYEE_ALREADY_CONTAIN_DEPARTMENT",
                        category: "EMPLOYEE",
                        deletedDate: new Date(COMMON.getCurrentUTC()),
                        action: "D"
                    }
                ]
            };
            break;
        case 97:
            msgobj = {
                messageBuildNumber: 98,
                developer: "Shweta",
                message: [
                    {
                        messageCode: "EMP10005",
                        messageKey: "EMPLOYEE_IN_DEPARTMENT_ADDED",
                        category: "EMPLOYEE",
                        deletedDate: new Date(COMMON.getCurrentUTC()),
                        action: "D"
                    }
                ]
            };
            break;
        case 98:
            msgobj = {
                messageBuildNumber: 99,
                developer: "Shweta",
                message: [
                    {
                        messageCode: "EMP10006",
                        messageKey: "DEPARTMENT_UPDATED_AS_DEFAULT",
                        category: "EMPLOYEE",
                        deletedDate: new Date(COMMON.getCurrentUTC()),
                        action: "D"
                    }
                ]
            };
            break;
        case 99:
            msgobj = {
                messageBuildNumber: 100,
                developer: "Shweta",
                message: [
                    {
                        messageCode: "MST50001",
                        messageKey: "OPERATION_OF_EMPLOYEE_NOT_FOUND",
                        messageType: "Information",
                        message: "Operation(s) for personnel are not Found.",
                        category: "MASTER",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 100:
            msgobj = {
                messageBuildNumber: 101,
                developer: "Shweta",
                message: [
                    {
                        messageCode: "MST10001",
                        messageKey: "OPERATION_FOR_EMPLOYEE_SAVED",
                        messageType: "Success",
                        message: "Operation(s) are assigned to personnel.",
                        category: "MASTER",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 101:
            msgobj = {
                messageBuildNumber: 102,
                developer: "Shweta",
                message: [
                    {
                        messageCode: "MST50002",
                        messageKey: "OPERATION_FOR_EMPLOYEE_NOT_SAVED",
                        messageType: "Information",
                        message: "Operation could not be assigned to personnel.",
                        category: "MASTER",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 102:
            msgobj = {
                messageBuildNumber: 103,
                developer: "Shweta",
                message: [
                    {
                        messageCode: "MST10002",
                        messageKey: "WORKSTATION_ADDED_TO_EMPLOYEE",
                        messageType: "Success",
                        message: "Workstation(s) are assigned to personnel.",
                        category: "MASTER",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 103:
            msgobj = {
                messageBuildNumber: 104,
                developer: "Shweta",
                message: [
                    {
                        messageCode: "MST50003",
                        messageKey: "WORKSTATION_NOT_ADDED_TO_EMPLOYEE",
                        messageType: "Information",
                        message: "Workstation could not be assigned to personnel.",
                        category: "MASTER",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 104:
            msgobj = {
                messageBuildNumber: 105,
                developer: "Shweta",
                message: [
                    {
                        messageCode: "MST10003",
                        messageKey: "WORKSTATION_DELETED_FROM_EMPLOYEE",
                        messageType: "Success",
                        message: "Workstation(s) are removed from personnel.",
                        category: "MASTER",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 105:
            msgobj = {
                messageBuildNumber: 106,
                developer: "Shweta",
                message: [
                    {
                        messageCode: "MST50004",
                        messageKey: "WORKSTATION_NOT_DELETED_FROM_EMPLOYEE",
                        messageType: "Information",
                        message: "Workstation could not be removed from personnel.",
                        category: "MASTER",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 106:
            msgobj = {
                messageBuildNumber: 107,
                developer: "Shweta",
                message: [
                    {
                        messageCode: "MST10004",
                        messageKey: "OPERATION_DELETED_FROM_EMPLOYEE",
                        messageType: "Success",
                        message: "Operation(s) are removed from personnel.",
                        category: "MASTER",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 107:
            msgobj = {
                messageBuildNumber: 108,
                developer: "Shweta",
                message: [
                    {
                        messageCode: "MST50005",
                        messageKey: "OPERATION_NOT_DELETED_FROM_EMPLOYEE",
                        messageType: "Information",
                        message: "Operation could not be removed from personnel.",
                        category: "MASTER",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 108:
            msgobj = {
                messageBuildNumber: 109,
                developer: "Shweta",
                message: [
                    {
                        messageCode: "MST50006",
                        messageKey: "EMPLOYEE_NOT_ADDED",
                        messageType: "Information",
                        message: "Personnel could not be added to department.",
                        category: "MASTER",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 109:
            msgobj = {
                messageBuildNumber: 110,
                developer: "Shweta",
                message: [
                    {
                        messageCode: "MST20001",
                        messageKey: "EMPLOYEE_ALREADY_CONTAIN_DEPARTMENT",
                        messageType: "Error",
                        message: "Personnel has already specified department! Please check.",
                        category: "MASTER",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 110:
            msgobj = {
                messageBuildNumber: 111,
                developer: "Shweta",
                message: [
                    {
                        messageCode: "MST10005",
                        messageKey: "EMPLOYEE_IN_DEPARTMENT_ADDED",
                        messageType: "Success",
                        message: "Personnel is added to department successfully.",
                        category: "MASTER",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 111:
            msgobj = {
                messageBuildNumber: 112,
                developer: "Shweta",
                message: [
                    {
                        messageCode: "MST10006",
                        messageKey: "DEPARTMENT_UPDATED_AS_DEFAULT",
                        messageType: "Success",
                        message: "Department is set as default for personnel.",
                        category: "MASTER",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 112:
            msgobj = {
                messageBuildNumber: 113,
                developer: "Shweta",
                message: [
                    {
                        messageCode: "GLB30004",
                        messageKey: "DYNAMIC_MESSAGE_UPDATION_ALERT",
                        category: "GLOBAL",
                        deletedDate: new Date(COMMON.getCurrentUTC()),
                        action: "D"
                    }
                ]
            };
            break;
        case 113:
            msgobj = {
                messageBuildNumber: 114,
                developer: "Shweta",
                message: [
                    {
                        messageCode: "GLB50001",
                        messageKey: "DYNAMIC_MESSAGE_COPY_CLIPBOARD",
                        category: "GLOBAL",
                        deletedDate: new Date(COMMON.getCurrentUTC()),
                        action: "D"
                    }
                ]
            };
            break;
        case 114:
            msgobj = {
                messageBuildNumber: 115,
                developer: "Shweta",
                message: [
                    {
                        messageCode: "GLB40007",
                        messageKey: "DYNAMIC_MESSAGE_UPDATE_PLACEHOLDER",
                        category: "GLOBAL",
                        deletedDate: new Date(COMMON.getCurrentUTC()),
                        action: "D"
                    }
                ]
            };
            break;
        case 115:
            msgobj = {
                messageBuildNumber: 116,
                developer: "Shweta",
                message: [
                    {
                        messageCode: "MST30001",
                        messageKey: "DYNAMIC_MESSAGE_UPDATION_ALERT",
                        messageType: "Warning",
                        message: "To get effect of changes, Please re-login for all users.",
                        category: "MASTER",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 116:
            msgobj = {
                messageBuildNumber: 117,
                developer: "Shweta",
                message: [
                    {
                        messageCode: "MST50007",
                        messageKey: "DYNAMIC_MESSAGE_COPY_CLIPBOARD",
                        messageType: "Information",
                        message: "{0} message copied to clipboard.",
                        category: "MASTER",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 117:
            msgobj = {
                messageBuildNumber: 118,
                developer: "Shweta",
                message: [
                    {
                        messageCode: "MST40003",
                        messageKey: "DYNAMIC_MESSAGE_UPDATE_PLACEHOLDER",
                        messageType: "Confirmation",
                        message: "Are your sure, do you want to update system defined placeholder ?",
                        category: "MASTER",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 118:
            msgobj = {
                messageBuildNumber: 119,
                developer: "Shweta",
                message: [
                    {
                        messageCode: "USR50001",
                        messageKey: "OLD_NEW_PASSWORD_DIFFERENT",
                        category: "USER",
                        deletedDate: new Date(COMMON.getCurrentUTC()),
                        action: "D"
                    }
                ]
            };
            break;
        case 119:
            msgobj = {
                messageBuildNumber: 120,
                developer: "Shweta",
                message: [
                    {
                        messageCode: "USR10001",
                        messageKey: "PASSWORD_UPDATED",
                        category: "USER",
                        deletedDate: new Date(COMMON.getCurrentUTC()),
                        action: "D"
                    }
                ]
            };
            break;
        case 120:
            msgobj = {
                messageBuildNumber: 121,
                developer: "Shweta",
                message: [
                    {
                        messageCode: "USR50002",
                        messageKey: "PASSWORD_NOT_UPDATED",
                        category: "USER",
                        deletedDate: new Date(COMMON.getCurrentUTC()),
                        action: "D"
                    }
                ]
            };
            break;
        case 121:
            msgobj = {
                messageBuildNumber: 122,
                developer: "Shweta",
                message: [
                    {
                        messageCode: "USR50003",
                        messageKey: "USER_PASSWORD_INCORRECT",
                        category: "USER",
                        deletedDate: new Date(COMMON.getCurrentUTC()),
                        action: "D"
                    }
                ]
            };
            break;
        case 122:
            msgobj = {
                messageBuildNumber: 123,
                developer: "Shweta",
                message: [
                    {
                        messageCode: "MST30002",
                        messageKey: "OLD_NEW_PASSWORD_DIFFERENT",
                        messageType: "Warning",
                        message: "New password must be different from the old password.",
                        category: "MASTER",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 123:
            msgobj = {
                messageBuildNumber: 124,
                developer: "Shweta",
                message: [
                    {
                        messageCode: "MST10007",
                        messageKey: "PASSWORD_UPDATED",
                        messageType: "Success",
                        message: "Password is reset successfully.",
                        category: "MASTER",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
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
                        messageCode: "MST50008",
                        messageKey: "PASSWORD_NOT_UPDATED",
                        messageType: "Information",
                        message: "Password reset is failed.",
                        category: "MASTER",
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
                        messageCode: "MST50009",
                        messageKey: "USER_PASSWORD_INCORRECT",
                        messageType: "Information",
                        message: "Password is incorrect.",
                        category: "MASTER",
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
                        messageCode: "MST40004",
                        messageKey: "CUSTOMER_DELETED_FROM_EMPLOYEE_CONFIRMATION",
                        messageType: "Confirmation",
                        message: "Customer will be remove from personnel mapping. Press yes to continue.",
                        category: "MASTER",
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
                        messageCode: "MST40005",
                        messageKey: "EMPLOYEE_DELETED_FROM_CUSTOMER_CONFIRMATION",
                        messageType: "Confirmation",
                        message: "Personnel will be remove from customer mapping. Press yes to continue.",
                        category: "MASTER",
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
                        messageCode: "MST10008",
                        messageKey: "CUSTOMER_ADDED_TO_EMPLOYEE",
                        messageType: "Success",
                        message: "Customer(s) are assigned to personnel.",
                        category: "MASTER",
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
                        messageCode: "MST10009",
                        messageKey: "EMPLOYEE_ADDED_TO_CUSTOMER",
                        messageType: "Success",
                        message: "Personnel(s) are assigned to customer.",
                        category: "MASTER",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
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
                        messageCode: "MST50010",
                        messageKey: "CUSTOMER_NOT_ADDED_TO_EMPLOYEE",
                        messageType: "Information",
                        message: "Customer could not be assigned to personnel.",
                        category: "MASTER",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 131:
            msgobj = {
                messageBuildNumber: 132,
                developer: "Shweta",
                message: [
                    {
                        messageCode: "MST50011",
                        messageKey: "EMPLOYEE_NOT_ADDED_TO_CUSTOMER",
                        messageType: "Information",
                        message: "Personnel could not be assigned to customer.",
                        category: "MASTER",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 132:
            msgobj = {
                messageBuildNumber: 133,
                developer: "Ashish",
                message: [
                    {
                        messageCode: "PRT20001",
                        messageKey: "INVALID_SELECT_PART",
                        messageType: "Error",
                        message: "Please select valid part(s)",
                        category: "GLOBAL",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 133:
            msgobj = {
                messageBuildNumber: 134,
                developer: "Ashish",
                message: [
                    {
                        messageCode: "RFQ40001",
                        messageKey: "DELETE_BOM_MESSAGE",
                        messageType: "Confirmation",
                        message: "All details of BOM including Part Costing as well as Labor cost details will be removed.",
                        category: "RFQ",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 134:
            msgobj = {
                messageBuildNumber: 135,
                developer: "Ashish",
                message: [
                    {
                        messageCode: "PRT50001",
                        messageKey: "COMPONENT_MAPP",
                        messageType: "Information",
                        message: "All part's properties are mapped.",
                        category: "PARTS",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 135:
            msgobj = {
                messageBuildNumber: 136,
                developer: "Ashish",
                message: [
                    {
                        messageCode: "PRT20002",
                        messageKey: "COMPONENT_ASSEMBLY_NOT_ALLOWED_TO_SAVE",
                        messageType: "Error",
                        message: "Assembly/Sales Kit allowed only if atleast one form Custom Part and CPN selected",
                        category: "PARTS",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 136:
            msgobj = {
                messageBuildNumber: 137,
                developer: "Ashish",
                message: [
                    {
                        messageCode: "PRT20003",
                        messageKey: "COMPONENT_ASSEMBLY_NICKNAME_SHOULD_BE_SAME_MESSAGE",
                        messageType: "Error",
                        message: "Invalid nickname <b>{0}</b>, in previous revision <b>{1}</b> nickname is used. please use that nickname.",
                        category: "PARTS",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 137:
            msgobj = {
                messageBuildNumber: 138,
                developer: "Ashish",
                message: [
                    {
                        messageCode: "PRT20004",
                        messageKey: "COMPONENT_ASSEMBLY_NICKNAME_DUPLICATE_MESSAGE",
                        messageType: "Error",
                        message: "<b>{0}</b> nickname is already used in part# <b>{1}</b>, please use different nickname.",
                        category: "PARTS",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 138:
            msgobj = {
                messageBuildNumber: 139,
                developer: "Ashish",
                message: [
                    {
                        messageCode: "PRT20005",
                        messageKey: "COMP_EXISTS",
                        messageType: "Error",
                        message: "Part# with same name already exists.",
                        category: "PARTS",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 139:
            msgobj = {
                messageBuildNumber: 140,
                developer: "Ashish",
                message: [
                    {
                        messageCode: "PRT20006",
                        messageKey: "COMP_PIDCODE",
                        messageType: "Error",
                        message: "PID code already exists.",
                        category: "PARTS",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 140:
            msgobj = {
                messageBuildNumber: 141,
                developer: "Ashish",
                message: [
                    {
                        messageCode: "PRT20007",
                        messageKey: "COMPONENT_UOM_EACH_VALIDATION",
                        messageType: "Error",
                        message: "'Count Type Each' is selected in Mounting type, So Unit must be 'EACH' only.",
                        category: "PARTS",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 141:
            msgobj = {
                messageBuildNumber: 142,
                developer: "Ashish",
                message: [
                    {
                        messageCode: "PRT20008",
                        messageKey: "COMP_SALES_ORDER",
                        messageType: "Error",
                        message: "Sales Order Already done for this part, you cannot change to 'RFQ Only'.",
                        category: "PARTS",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 142:
            msgobj = {
                messageBuildNumber: 143,
                developer: "Ashish",
                message: [
                    {
                        messageCode: "PRT20009",
                        messageKey: "COMP_DIST_PART_STATUS_VALIDATION",
                        messageType: "Error",
                        message: "You cannot update Supplier Part Status as MFR Part Status is not matched.",
                        category: "PARTS",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 143:
            msgobj = {
                messageBuildNumber: 144,
                developer: "Ashish",
                message: [
                    {
                        messageCode: "PRT20010",
                        messageKey: "COMPONENT_BOM_ACTIVITY_STARTED_VALIDATION_MESSAGE",
                        messageType: "Error",
                        message: "BOM activity started for assembly <b>{0}</b> in which this part is used. please stop activity then try to update part.",
                        category: "PARTS",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 144:
            msgobj = {
                messageBuildNumber: 145,
                developer: "Ashish",
                message: [
                    {
                        messageCode: "PRT20011",
                        messageKey: "COMP_MARERIAL_RECEIDED_UOM_VALIDATION",
                        messageType: "Error",
                        message: "Material received for this Part, you cannot change Unit/UOM.",
                        category: "PARTS",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 145:
            msgobj = {
                messageBuildNumber: 146,
                developer: "Ashish",
                message: [
                    {
                        messageCode: "PRT20012",
                        messageKey: "COMP_RESERVED_STOCK_UOM_VALIDATION",
                        messageType: "Error",
                        message: "Part is used in Reserved Stock, you cannot change Unit/UOM.",
                        category: "PARTS",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 146:
            msgobj = {
                messageBuildNumber: 147,
                developer: "Ashish",
                message: [
                    {
                        messageCode: "PRT20013",
                        messageKey: "PACKAGING_MPPING",
                        messageType: "Error",
                        message: "Packaging part already assigned.",
                        category: "PARTS",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 147:
            msgobj = {
                messageBuildNumber: 148,
                developer: "Ashish",
                message: [
                    {
                        messageCode: "PRT20014",
                        messageKey: "ROHS_ALTERNATEPN_MAPPING",
                        messageType: "Error",
                        message: "RoHS alternate alias already assigned.",
                        category: "PARTS",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 148:
            msgobj = {
                messageBuildNumber: 149,
                developer: "Ashish",
                message: [
                    {
                        messageCode: "PRT20015",
                        messageKey: "COMP_DRIVETOOLS_VALIDATION",
                        messageType: "Error",
                        message: "Drive tool entry already exists.",
                        category: "PARTS",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 149:
            msgobj = {
                messageBuildNumber: 150,
                developer: "Ashish",
                message: [
                    {
                        messageCode: "PRT20016",
                        messageKey: "COMP_PROCESS_MATERIAL_VALIDATION",
                        messageType: "Error",
                        message: "Process material entry already exists.",
                        category: "PARTS",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 150:
            msgobj = {
                messageBuildNumber: 151,
                developer: "Ashish",
                message: [
                    {
                        messageCode: "PRT50002",
                        messageKey: "COMP_UPTODATE",
                        messageType: "Information",
                        message: "All parts are up to date.",
                        category: "PARTS",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 151:
            msgobj = {
                messageBuildNumber: 152,
                developer: "Ashish",
                message: [
                    {
                        messageCode: "PRT20017",
                        messageKey: "COMP_OTHER_PART",
                        messageType: "Error",
                        message: "Other Part Name already exists.",
                        category: "PARTS",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 152:
            msgobj = {
                messageBuildNumber: 153,
                developer: "Ashish",
                message: [
                    {
                        messageCode: "PRT20018",
                        messageKey: "COMP_FUNCTIONAL_TESTING_EQUIPMENT",
                        messageType: "Error",
                        message: "Functional Testing Equipment already exists.",
                        category: "PARTS",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 153:
            msgobj = {
                messageBuildNumber: 154,
                developer: "Ashish",
                message: [
                    {
                        messageCode: "PRT20019",
                        messageKey: "COMP_TEMPERATURE_SENSITIVE_DATA_VALIDATION",
                        messageType: "Error",
                        message: "Temperature Sensitive data already exists.",
                        category: "PARTS",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 154:
            msgobj = {
                messageBuildNumber: 155,
                developer: "Ashish",
                message: [
                    {
                        messageCode: "PRT50003",
                        messageKey: "COMPONENT_COPY_SUCCESS_MESSAGE",
                        messageType: "Information",
                        message: "Part Details Copied Successfully.",
                        category: "PARTS",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 155:
            msgobj = {
                messageBuildNumber: 156,
                developer: "Ashish",
                message: [
                    {
                        messageCode: "PRT50004",
                        messageKey: "COMPONENT_ASSEMBLY_REVISION_CREATED_MESSAGE",
                        messageType: "Information",
                        message: "Assembly Revision Created Successfully.",
                        category: "PARTS",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 156:
            msgobj = {
                messageBuildNumber: 157,
                developer: "Ashish",
                message: [
                    {
                        messageCode: "PRT40001",
                        messageKey: "ADD_PICKUP_PAD_CONFIRMATION_BODY_MESSAGE",
                        messageType: "Confirmation",
                        message: "Are you sure you want to add <b>{0}</b> as <b>Pickup Pad</b>? Press Yes to Continue.",
                        category: "PARTS",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 157:
            msgobj = {
                messageBuildNumber: 158,
                developer: "Ashish",
                message: [
                    {
                        messageCode: "PRT40002",
                        messageKey: "ADD_PROGRAMMING_CONFIRMATION_BODY_MESSAGE",
                        messageType: "Confirmation",
                        message: "Are you sure you want to add <b>{0}</b> as <b>Programming</b>? Press Yes to Continue.",
                        category: "PARTS",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 158:
            msgobj = {
                messageBuildNumber: 159,
                developer: "Ashish",
                message: [
                    {
                        messageCode: "PRT40003",
                        messageKey: "ADD_FUNCTIONAL_TESTING_CONFIRMATION_BODY_MESSAGE",
                        messageType: "Confirmation",
                        message: "Are you sure you want to add <b>{0}</b> as <b>Functional Testing Tool</b>? Press Yes to Continue.",
                        category: "PARTS",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 159:
            msgobj = {
                messageBuildNumber: 160,
                developer: "Ashish",
                message: [
                    {
                        messageCode: "PRT40004",
                        messageKey: "ADD_ALTERNATE_PART_CONFIRMATION_BODY_MESSAGE",
                        messageType: "Confirmation",
                        message: "Are you sure you want to add <b>{0}</b> as <b>Alternate Part</b>? Press Yes to Continue.",
                        category: "PARTS",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 160:
            msgobj = {
                messageBuildNumber: 161,
                developer: "Ashish",
                message: [
                    {
                        messageCode: "PRT40005",
                        messageKey: "ADD_DRIVE_TOOL_CONFIRMATION_BODY_MESSAGE",
                        messageType: "Confirmation",
                        message: "Are you sure you want to add <b>{0}</b> as <b>Drive Tool</b>? Press Yes to Continue.",
                        category: "PARTS",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 161:
            msgobj = {
                messageBuildNumber: 162,
                developer: "Ashish",
                message: [
                    {
                        messageCode: "PRT40006",
                        messageKey: "ADD_REQUIRE_MATING_PARTS_CONFIRMATION_BODY_MESSAGE",
                        messageType: "Confirmation",
                        message: "Are you sure you want to add <b>{0}</b> as <b>Require Mating Parts</b>? Press Yes to Continue.",
                        category: "PARTS",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 162:
            msgobj = {
                messageBuildNumber: 163,
                developer: "Ashish",
                message: [
                    {
                        messageCode: "PRT40007",
                        messageKey: "ADD_PROCESS_MATERIAL_CONFIRMATION_BODY_MESSAGE",
                        messageType: "Confirmation",
                        message: "Are you sure you want to add <b>{0}</b> as <b>Process Material</b>? Press Yes to Continue.",
                        category: "PARTS",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
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
                        messageCode: "PRT40008",
                        messageKey: "ADD_ROHS_ALTERNATE_PART_CONFIRMATION_BODY_MESSAGE",
                        messageType: "Confirmation",
                        message: "Are you sure you want to add <b>{0}</b> as <b>RoHS Replacement Part</b>? Press Yes to Continue.",
                        category: "PARTS",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 164:
            msgobj = {
                messageBuildNumber: 165,
                developer: "Ashish",
                message: [
                    {
                        messageCode: "PRT40009",
                        messageKey: "ADD_PACKING_ALIAS_CONFIRMATION_BODY_MESSAGE",
                        messageType: "Confirmation",
                        message: "Are you sure you want to add <b>{0}</b> as <b>Packaging Alias Part</b>? Press Yes to Continue.",
                        category: "PARTS",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 165:
            msgobj = {
                messageBuildNumber: 166,
                developer: "Ashish",
                message: [
                    {
                        messageCode: "PRT40010",
                        messageKey: "ADD_FUNCTIONAL_TESTING_EQUIPMENT_CONFIRMATION_BODY_MESSAGE",
                        messageType: "Confirmation",
                        message: "Are you sure you want to add <b>{0}</b> as <b>Functional Testing Equipment</b>? Press Yes to Continue.",
                        category: "PARTS",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 166:
            msgobj = {
                messageBuildNumber: 167,
                developer: "Ashish",
                message: [
                    {
                        messageCode: "PRT20020",
                        messageKey: "BAD_PART_CREATION_FEATURE_BASED_VALIDATION",
                        messageType: "Error",
                        message: "You don't have rights to create/change Incorrect part.\nPlease contact Administrator.",
                        category: "PARTS",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 167:
            msgobj = {
                messageBuildNumber: 168,
                developer: "Ashish",
                message: [
                    {
                        messageCode: "PRT40011",
                        messageKey: "PART_STATUS_NON_ACTIVE_CREATE",
                        messageType: "Confirmation",
                        message: "Are you sure to create part with <b>{0}</b> status. Press Yes to Continue.",
                        category: "PARTS",
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
                        messageCode: "PRT20020",
                        messageKey: "COMPONENT_ALTERNATE_PART_MAPPING_PARAMETER_NOT_MATCH_MESSAGE",
                        messageType: "Error",
                        message: "<b>{0}</b> Parameter not match. You cannot add as <b>{1}</b>.",
                        category: "PARTS",
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
                        messageCode: "PRT40012",
                        messageKey: "DELETE_COMPONENT_BLOCK_ITEM_CONFIRMATION_BOBY_MESSAGE",
                        messageType: "Confirmation",
                        message: "Are you sure to delete <b>{0}</b> from <b>{1}</b>? Press Yes to Continue.",
                        category: "PARTS",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
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
                        messageCode: "PRT40013",
                        messageKey: "ADD_OTHER_PART_NAME_CONFIRMATION_BODY_MESSAGE",
                        messageType: "Confirmation",
                        message: "Are you sure you want to add <b>{0}</b> as <b>Other Part Name</b>? Press Yes to Continue.",
                        category: "PARTS",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
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
                        messageCode: "PRT40014",
                        messageKey: "COMPONENT_CUSTOM_PART_CONFIRMATION_BODY_MESSAGE",
                        messageType: "Confirmation",
                        message: "Revision required for the Custom MFR part, Press Yes to Continue.",
                        category: "PARTS",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 172:
            msgobj = {
                messageBuildNumber: 173,
                developer: "Ashish",
                message: [
                    {
                        messageCode: "PRT40015",
                        messageKey: "COMPONENT_DATA_SHEET_URL_DELETE_CONFIRMATION_MESSAGE",
                        messageType: "Confirmation",
                        message: "Are you sure to delete Data Sheet? Press Yes to Continue.",
                        category: "PARTS",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 173:
            msgobj = {
                messageBuildNumber: 174,
                developer: "Shweta",
                message: [
                    {
                        messageCode: "MST10010",
                        messageKey: "CUSTOMER_DELETED_FROM_EMPLOYEE",
                        messageType: "Success",
                        message: "Customer(s) are removed from personnel.",
                        category: "MASTER",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 174:
            msgobj = {
                messageBuildNumber: 175,
                developer: "Shweta",
                message: [
                    {
                        messageCode: "MST10011",
                        messageKey: "EMPLOYEE_DELETED_FROM_CUSTOMER",
                        messageType: "Success",
                        message: "Personnel(s) are removed from customer.",
                        category: "MASTER",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 175:
            msgobj = {
                messageBuildNumber: 176,
                developer: "Shweta",
                message: [
                    {
                        messageCode: "MST10012",
                        messageKey: "ADDRESS_UPDATED_AS_DEFAULT",
                        messageType: "Success",
                        message: "Address has been set as default.",
                        category: "MASTER",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 176:
            msgobj = {
                messageBuildNumber: 177,
                developer: "Shweta",
                message: [
                    {
                        messageCode: "MST20002",
                        messageKey: "EMAIL_DUPLICATE_REPORT_SETTING",
                        messageType: "Error",
                        message: "Duplicate e-mail report setting exists!",
                        category: "MASTER",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 177:
            msgobj = {
                messageBuildNumber: 178,
                developer: "Shweta",
                message: [
                    {
                        messageCode: "MST20003",
                        messageKey: "EMAIL_DUPLICATE_RECIPIENT",
                        messageType: "Error",
                        message: "Duplicate recipient exists!",
                        category: "MASTER",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 178:
            msgobj = {
                messageBuildNumber: 179,
                developer: "Shweta",
                message: [
                    {
                        messageCode: "GLB20013",
                        messageKey: "COMMON_TYPE_EXISTS",
                        messageType: "Error",
                        message: "<b>{0}</b> alias name already exists in {1} <b>{2}</b>.",
                        category: "GLOBAL",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 179:
            msgobj = {
                messageBuildNumber: 180,
                developer: "Shweta",
                message: [
                    {
                        messageCode: "MST20005",
                        messageKey: "COMPONENT_ALIAS_EXISTS",
                        messageType: "Error",
                        message: "Following alias name already exists.{0}",
                        category: "MASTER",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 180:
            msgobj = {
                messageBuildNumber: 181,
                developer: "Shweta",
                message: [
                    {
                        messageCode: "GLB30009",
                        messageKey: "ALIAS_ALREADY_ADDED",
                        messageType: "Warning",
                        message: "Alias is already added.",
                        category: "GLOBAL",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 181:
            msgobj = {
                messageBuildNumber: 182,
                developer: "Shweta",
                message: [
                    {
                        messageCode: "GLB40009",
                        messageKey: "ALIAS_NOT_ADDED_CONFRIMATION",
                        messageType: "Confirmation",
                        message: "Entered alias is not added yet. Do you want to continue?",
                        category: "GLOBAL",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 182:
            msgobj = {
                messageBuildNumber: 183,
                developer: "Shweta",
                message: [
                    {
                        messageCode: "GLB20012",
                        messageKey: "ALIAS_EXISTS",
                        messageType: "Error",
                        message: "<b>{0}</b> alias name already exists in {1} <b>{2}</b>.",
                        category: "GLOBAL",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 183:
            msgobj = {
                messageBuildNumber: 184,
                developer: "Shweta",
                message: [
                    {
                        messageCode: "GLB30007",
                        messageKey: "MFG_ALIAS_EXISTS",
                        category: "GLOBAL",
                        deletedDate: new Date(COMMON.getCurrentUTC()),
                        action: "D"
                    }
                ]
            };
            break;
        case 184:
            msgobj = {
                messageBuildNumber: 185,
                developer: "Shweta",
                message: [
                    {
                        messageCode: "GLB40010",
                        messageKey: "WANT_TO_EDIT_RECORD",
                        messageType: "Confirmation",
                        message: "Would you like to update information?",
                        category: "GLOBAL",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 185:
            msgobj = {
                messageBuildNumber: 186,
                developer: "Shirish",
                message: [
                    {
                        messageCode: "GLB20013",
                        messageKey: "ALLOW_FILE_TO_UPLOAD",
                        messageType: "Error",
                        message: "Please upload files with the following supported extensions: <br /><b>{0}</b>",
                        category: "GLOBAL",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 186:
            msgobj = {
                messageBuildNumber: 187,
                developer: "Shirish",
                message: [
                    {
                        messageCode: "GLB20014",
                        messageKey: "SELECTED_VALID_FILE",
                        messageType: "Error",
                        message: "Only <b>{0}</b> files are selected from <b>{1}</b> files, as there are some unsupported files are being uploaded.",
                        category: "GLOBAL",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 187:
            msgobj = {
                messageBuildNumber: 188,
                developer: "Shirish",
                message: [
                    {
                        messageCode: "GLB30010",
                        messageKey: "SELECET_FOLDER",
                        messageType: "Warning",
                        message: "Please select folder.",
                        category: "GLOBAL",
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
                        messageCode: "GLB40011",
                        messageKey: "ENABLE_DISABLE_DOCUMENT",
                        messageType: "Confirmation",
                        message: "Are you sure want to {0} \"{1}\" document?",
                        category: "GLOBAL",
                        createdDate: new Date(COMMON.getCurrentUTC()),
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
                        messageCode: "GLB20016",
                        messageKey: "DocumentSizeError_NotAllowed",
                        messageType: "Error",
                        message: "Document size more than 16 Mb is not allowed",
                        category: "GLOBAL",
                        createdDate: new Date(COMMON.getCurrentUTC()),
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
                        messageCode: "GLB20015",
                        messageKey: "UPLOAD_UNSUPPORTED_FILE",
                        messageType: "Error",
                        message: "Unsupported files are being uploaded.",
                        category: "GLOBAL",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
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
                        messageCode: "GLB50014",
                        messageKey: "SELECT_ASSIGN_ATLEAST_ONE_ROLE",
                        messageType: "Information",
                        message: "Please assign at least one role.",
                        category: "GLOBAL",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 192:
            msgobj = {
                messageBuildNumber: 193,
                developer: "Shirish",
                message: [{
                    messageCode: "GLB50015",
                    messageKey: "SELECT_DOCUMENT",
                    messageType: "Information",
                    message: "Please select document(s).",
                    category: "GLOBAL",
                    createdDate: new Date(COMMON.getCurrentUTC()),
                    action: "I"
                }]
            };
            break;
        case 193:
            msgobj = {
                messageBuildNumber: 194,
                developer: "Shirish",
                message: [{
                    messageCode: "GLB30011",
                    messageKey: "DOCUMENT_ALREADY_ADDED",
                    messageType: "Warning",
                    message: "Document {0) already added.",
                    category: "GLOBAL",
                    createdDate: new Date(COMMON.getCurrentUTC()),
                    action: "I"
                }]
            };
            break;
        case 194:
            msgobj = {
                messageBuildNumber: 195,
                developer: "Shweta",
                message: [{
                    messageCode: "GLB30012",
                    messageKey: "ALREADY_IN_USE",
                    messageType: "Warning",
                    message: "{0} is already in use.",
                    category: "GLOBAL",
                    createdDate: new Date(COMMON.getCurrentUTC()),
                    action: "I"
                }]
            };
            break;
        case 195:
            msgobj = {
                messageBuildNumber: 196,
                developer: "Shweta",
                message: [{
                    messageCode: "MST20006",
                    messageKey: "INVALID_FILE_DATA",
                    messageType: "Error",
                    message: "Error in document processing. Please check document data",
                    category: "MASTER",
                    createdDate: new Date(COMMON.getCurrentUTC()),
                    action: "I"
                }]
            };
            break;
        case 196:
            msgobj = {
                messageBuildNumber: 197,
                developer: "Shweta",
                message: [{
                    messageCode: "USR40001",
                    messageKey: "SURE_TO_IMPORT_GENERICCATEGRY_FILE",
                    messageType: "Confirmation",
                    category: "USER",
                    createdDate: new Date(COMMON.getCurrentUTC()),
                    action: "D"
                }]
            };
            break;
        case 197:
            msgobj = {
                messageBuildNumber: 198,
                developer: "Shweta",
                message: [{
                    messageCode: "USR20001",
                    messageKey: "SELECT_ONE",
                    messageType: "Error",
                    category: "USER",
                    createdDate: new Date(COMMON.getCurrentUTC()),
                    action: "D"
                }]
            };
            break;
        case 198:
            msgobj = {
                messageBuildNumber: 199,
                developer: "Shweta",
                message: [
                    {
                        messageCode: "GLB40012",
                        messageKey: "SURE_TO_IMPORT_GENERICCATEGRY_FILE",
                        messageType: "Confirmation",
                        message: "Are you sure to import the selected document as {0}? Document details will be imported as {0}.",
                        category: "GLOBAL",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 199:
            msgobj = {
                messageBuildNumber: 200,
                developer: "Shweta",
                message: [
                    {
                        messageCode: "GLB20017",
                        messageKey: "SELECT_ONE",
                        messageType: "Error",
                        message: "Please select at least one {0}.",
                        category: "GLOBAL",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 200:
            msgobj = {
                messageBuildNumber: 201,
                developer: "Ashish",
                message: [
                    {
                        messageCode: "PRT40016",
                        messageKey: "DELETE_FUNCTIONAL_TYPE_PART_CONFIRMATION_BODY_MESSAGE",
                        messageType: "Confirmation",
                        message: "Are you sure you want to delete <b>{0}</b> from required functional type? Press Yes to Continue.",
                        category: "PARTS",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 201:
            msgobj = {
                messageBuildNumber: 202,
                developer: "Ashish",
                message: [
                    {
                        messageCode: "PRT40017",
                        messageKey: "DELETE_MOUNTING_TYPE_PART_CONFIRMATION_BODY_MESSAGE",
                        messageType: "Confirmation",
                        message: "Are you sure you want to delete <b>{0}</b>  from required mounting type? Press Yes to Continue.",
                        category: "PARTS",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 202:
            msgobj = {
                messageBuildNumber: 203,
                developer: "Shirish",
                message: [
                    {
                        messageCode: "GLB20018",
                        messageKey: "ALLOW_FILE_TO_UPLOAD",
                        messageType: "Error",
                        message: "Please upload files with the following supported extensions: <br /><b>{0}</b>",
                        category: "GLOBAL",
                        modifiedDate: new Date(COMMON.getCurrentUTC()),
                        action: "U"
                    }
                ]
            };
            break;
        case 203:
            msgobj = {
                messageBuildNumber: 204,
                developer: "Ashish",
                message: [
                    {
                        messageCode: "PRT20022",
                        messageKey: "COMPONENT_ALTERNATE_PART_MAPPING_PARAMETER_NOT_MATCH_MESSAGE",
                        messageType: "Error",
                        message: "<b>{0}</b> Parameter not match. You cannot add as <b>{1}</b>.",
                        category: "PARTS",
                        modifiedDate: new Date(COMMON.getCurrentUTC()),
                        action: "U"
                    }
                ]
            };
            break;
        case 204:
            msgobj = {
                messageBuildNumber: 205,
                developer: "Ashish",
                message: [
                    {
                        messageCode: "PRT40018",
                        messageKey: "COMPONENT_ATTRIBUTES_UPDATE_CONFIRMATION_MESSAGE",
                        messageType: "Confirmation",
                        message: "Are you sure to update selected part(s) attributes including their supplier part(s)? Press Yes to Continue.",
                        category: "PARTS",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 205:
            msgobj = {
                messageBuildNumber: 206,
                developer: "Ashish",
                message: [
                    {
                        messageCode: "PRT20021",
                        messageKey: "UNIQUE_PRICE_BREAK",
                        messageType: "Error",
                        message: "Price break should be different.",
                        category: "PARTS",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 206:
            msgobj = {
                messageBuildNumber: 207,
                developer: "Ashish",
                message: [
                    {
                        messageCode: "PRT40019",
                        messageKey: "PRICE_BREAK_UPDATE_CONFIRMATION",
                        messageType: "Confirmation",
                        message: "Selected Cell Price Break: <b>{0}</b> and Unit Price: <b>{1}</b> break will be update. Press Yes to Continue.",
                        category: "PARTS",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 207:
            msgobj = {
                messageBuildNumber: 208,
                developer: "Ashish",
                message: [
                    {
                        messageCode: "PRT20001",
                        messageKey: "INVALID_SELECT_PART",
                        messageType: "Error",
                        category: "GLOBAL",
                        deletedDate: new Date(COMMON.getCurrentUTC()),
                        action: "D"
                    }
                ]
            };
            break;
        case 208:
            msgobj = {
                messageBuildNumber: 209,
                developer: "Ashish",
                message: [
                    {
                        messageCode: "PRT20001",
                        messageKey: "INVALID_SELECT_PART",
                        messageType: "Error",
                        message: "Please select valid part(s)",
                        category: "PARTS",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 209:
            msgobj = {
                messageBuildNumber: 210,
                developer: "Dharmesh",
                message: [{
                    messageCode: "RCV30001",
                    messageKey: "WAREHOUSE_UNIQUE_IN_BIN",
                    messageType: "Warning",
                    message: "{0} name <b>{1}</b> is already exist in bin name.",
                    category: "RECEIVING",
                    createdDate: new Date(COMMON.getCurrentUTC()),
                    action: "I"
                }]
            };
            break;
        case 210:
            msgobj = {
                messageBuildNumber: 211,
                developer: "Dharmesh",
                message: [{
                    messageCode: "RCV30002",
                    messageKey: "WAREHOUSE_UNIQUE",
                    messageType: "Warning",
                    message: "{0} name <b>{1}</b> is already exist.",
                    category: "RECEIVING",
                    createdDate: new Date(COMMON.getCurrentUTC()),
                    action: "I"
                }]
            };
            break;
        case 211:
            msgobj = {
                messageBuildNumber: 212,
                developer: "Dharmesh",
                message: [{
                    messageCode: "RCV30003",
                    messageKey: "WAREHOUSE_UNIQUE_SIDE1",
                    messageType: "Warning",
                    message: "{0} name <b>{1} (Side 1)</b> is already exist.",
                    category: "RECEIVING",
                    createdDate: new Date(COMMON.getCurrentUTC()),
                    action: "I"
                }]
            };
            break;
        case 212:
            msgobj = {
                messageBuildNumber: 213,
                developer: "Dharmesh",
                message: [{
                    messageCode: "RCV30004",
                    messageKey: "WAREHOUSE_UNIQUE_SIDE2",
                    messageType: "Warning",
                    message: "{0} name <b>{1} (Side 2)</b> is already exist.",
                    category: "RECEIVING",
                    createdDate: new Date(COMMON.getCurrentUTC()),
                    action: "I"
                }]
            };
            break;
        case 213:
            msgobj = {
                messageBuildNumber: 214,
                developer: "Dharmesh",
                message: [{
                    messageCode: "RCV30005",
                    messageKey: "USE_WH_IN_OTHER",
                    messageType: "Warning",
                    message: "Cannot inactive Warehouse because it is in use.",
                    category: "RECEIVING",
                    createdDate: new Date(COMMON.getCurrentUTC()),
                    action: "I"
                }]
            };
            break;
        case 214:
            msgobj = {
                messageBuildNumber: 215,
                developer: "Dharmesh",
                message: [{
                    messageCode: "RCV40001",
                    messageKey: "CHECKIN_CANCEL_ALL_CONFIRM",
                    messageType: "Confirmation",
                    message: "All current checkin request will be cancel. Press Yes to Continue.",
                    category: "RECEIVING",
                    createdDate: new Date(COMMON.getCurrentUTC()),
                    action: "I"
                }]
            };
            break;
        case 215:
            msgobj = {
                messageBuildNumber: 216,
                developer: "Shweta",
                message: [
                    {
                        messageCode: "MST20007",
                        messageKey: "MFG_ALIAS_NOT_DELETE",
                        messageType: "Error",
                        message: "Alias already used in BOM. {0} to check assembly(s).",
                        category: "MASTER",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 216:
            msgobj = {
                messageBuildNumber: 217,
                developer: "Shweta",
                message: [
                    {
                        messageCode: "MST20008",
                        messageKey: "CPN_UPLOAD_ERR",
                        messageType: "Error",
                        message: "CPN(Comonent) is uploaded with error please check error file.",
                        category: "MASTER",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 217:
            msgobj = {
                messageBuildNumber: 218,
                developer: "Shweta",
                message: [
                    {
                        messageCode: "MST10013",
                        messageKey: "CPN_UPLOAD_SUCCESS",
                        messageType: "Success",
                        message: "CPN(Comonent) is uploaded successfully.",
                        category: "MASTER",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 218:
            msgobj = {
                messageBuildNumber: 219,
                developer: "Shubham",
                message: [
                    {
                        messageCode: "MFG20001",
                        messageKey: "SERIAL_NO_LIMIT_EXISTS",
                        messageType: "Error",
                        message: "Serial# <b>{0}</b> limit exists as you given No of digits <b>{1}</b>. Add more serial#, change No of digit limit.",
                        category: "MFG",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 219:
            msgobj = {
                messageBuildNumber: 220,
                developer: "Shubham",
                message: [
                    {
                        messageCode: "MFG20002",
                        messageKey: "DUPLICATE_SERIAL",
                        messageType: "Error",
                        message: "This serial# <b>{0}</b> already generated.",
                        category: "MFG",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 220:
            msgobj = {
                messageBuildNumber: 221,
                developer: "Shubham",
                message: [
                    {
                        messageCode: "MFG40001",
                        messageKey: "SERIAL_NUMBER_COUNT",
                        messageType: "Confirmation",
                        message: "Total <b>{0}</b> serial numbers will be generated from <b>{1}</b> to <b>{2}</b>. Are you sure? Press Yes to continue ?",
                        category: "MFG",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 221:
            msgobj = {
                messageBuildNumber: 222,
                developer: "Shubham",
                message: [
                    {
                        messageCode: "MFG50001",
                        messageKey: "WORKORDER_SERIAL_VALIDATION",
                        messageType: "Information",
                        message: "Please check the limit of serial number generation.",
                        category: "MFG",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 222:
            msgobj = {
                messageBuildNumber: 223,
                developer: "Shubham",
                message: [
                    {
                        messageCode: "MFG20003",
                        messageKey: "SERIAL_NO_ALREADY_IN_USE",
                        messageType: "Error",
                        message: "Work Order: Serial numbers are already in use.",
                        category: "MFG",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 223:
            msgobj = {
                messageBuildNumber: 224,
                developer: "Shubham",
                message: [
                    {
                        messageCode: "MFG20004",
                        messageKey: "SERIALS_MORETHAN_BUILD_QTY_MSG",
                        messageType: "Error",
                        message: "More than build quantity is not allowed.",
                        category: "MFG",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 224:
            msgobj = {
                messageBuildNumber: 225,
                developer: "Shubham",
                message: [
                    {
                        messageCode: "MFG20005",
                        messageKey: "MFG_SERIAL_ALREADY_MAPPED",
                        messageType: "Error",
                        message: "MFG serial \"{0}\" already mapped with product serial \"{1}\".",
                        category: "MFG",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 225:
            msgobj = {
                messageBuildNumber: 226,
                developer: "Shubham",
                message: [
                    {
                        messageCode: "MFG20006",
                        messageKey: "PRODUCT_SERIAL_ALREADY_MAPPED",
                        messageType: "Error",
                        message: "Product serial \"{0}\" already mapped with MFG serial \"{1}\".",
                        category: "MFG",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 226:
            msgobj = {
                messageBuildNumber: 227,
                developer: "Shubham",
                message: [
                    {
                        messageCode: "MFG20007",
                        messageKey: "SERIAL_NO_SCRAP_IN_PEOCESS",
                        messageType: "Error",
                        message: "Work Order: Selected serial number is scrapped. You cannot move further.",
                        category: "MFG",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 227:
            msgobj = {
                messageBuildNumber: 228,
                developer: "Shubham",
                message: [
                    {
                        messageCode: "MFG20008",
                        messageKey: "SERIAL_NO_EXISTS_IN_WORKORDER_TRANSACTION",
                        messageType: "Error",
                        message: "Work Order: Serial numbers are already in-process. Please check.",
                        category: "MFG",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 228:
            msgobj = {
                messageBuildNumber: 229,
                developer: "Shubham",
                message: [
                    {
                        messageCode: "MFG20009",
                        messageKey: "SERIAL_NO_ALREADY_PROCESSED",
                        messageType: "Error",
                        message: "Serial number already processed. It cannot be removed.",
                        category: "MFG",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 229:
            msgobj = {
                messageBuildNumber: 230,
                developer: "Shubham",
                message: [
                    {
                        messageCode: "MFG20010",
                        messageKey: "SERIALS_ALREADY_USED",
                        messageType: "Error",
                        message: "Serials number already in used.",
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
                developer: "Dharmesh",
                message: [
                    {
                        messageCode: "MST30003",
                        messageKey: "UNVERIFIED_LABEL_TEMPLATE",
                        messageType: "Warning",
                        message: "You need to verify label template first.",
                        category: "MASTER",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 231:
            msgobj = {
                messageBuildNumber: 232,
                developer: "Dharmesh",
                message: [
                    {
                        messageCode: "MST20009",
                        messageKey: "BAD_PORT",
                        messageType: "Error",
                        message: "Entered port number <b>{0}</b> is invalid, port number should be between <b>0</b> to <b>65536</b> only.",
                        category: "MASTER",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;

        case 232:
            msgobj = {
                messageBuildNumber: 233,
                developer: "Dharmesh",
                message: [
                    {
                        messageCode: "MST30004",
                        messageKey: "INVALID_PORT",
                        messageType: "Warning",
                        message: "Port number value must be numeric only.",
                        category: "MASTER",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;

        case 233:
            msgobj = {
                messageBuildNumber: 234,
                developer: "Dharmesh",
                message: [
                    {
                        messageCode: "MST50013",
                        messageKey: "CONNECTION_REFUSED",
                        messageType: "Information",
                        message: "Connection is refused by server. Either <b>BarTender</b> is not installed or <b>service</b> is not started yet. Please check once.",
                        category: "MASTER",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 234:
            msgobj = {
                messageBuildNumber: 235,
                developer: "Dharmesh",
                message: [
                    {
                        messageCode: "MST20010",
                        messageKey: "INVALID_IP",
                        messageType: "Error",
                        message: "Invalid BarTender server IP.",
                        category: "MASTER",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;

        case 235:
            msgobj = {
                messageBuildNumber: 236,
                developer: "Dharmesh",
                message: [
                    {
                        messageCode: "MST20011",
                        messageKey: "INVALID_PRINT_LABEL",
                        messageType: "Error",
                        message: "Invalid label template name.",
                        category: "MASTER",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;

        case 236:
            msgobj = {
                messageBuildNumber: 237,
                developer: "Dharmesh",
                message: [
                    {
                        messageCode: "MST10014",
                        messageKey: "WEBSERVICE_CHECK_SUCCESS",
                        messageType: "Success",
                        message: "Label template <b>{0}</b> is configured successfully.",
                        category: "MASTER",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;

        case 237:
            msgobj = {
                messageBuildNumber: 238,
                developer: "Dharmesh",
                message: [
                    {
                        messageCode: "MST50014",
                        messageKey: "WEBSERVICE_CHECK_INFO",
                        messageType: "Information",
                        message: "Label template <b>{0}</b> might not be configured in bartender software yet. Please check once.",
                        category: "MASTER",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 238:
            msgobj = {
                messageBuildNumber: 239,
                developer: "Dharmesh",
                message: [
                    {
                        messageCode: "MST10015",
                        messageKey: "PRINT_JOB_SUCCESS",
                        messageType: "Success",
                        message: "Print job is done successfully.",
                        category: "MASTER",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 239:
            msgobj = {
                messageBuildNumber: 240,
                developer: "Dharmesh",
                message: [
                    {
                        messageCode: "MST20012",
                        messageKey: "PRINT_JOB_ERROR",
                        messageType: "Error",
                        message: "Print job is unsuccessful.",
                        category: "MASTER",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 240:
            msgobj = {
                messageBuildNumber: 241,
                developer: "Ashish",
                message: [
                    {
                        messageCode: "PRT20023",
                        messageKey: "PRICE_BREAK_VALIDATION_MESSAGE",
                        messageType: "Error",
                        message: "{0} Price break unit price must be less or equal to all lower price break.",
                        category: "PARTS",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 241:
            msgobj = {
                messageBuildNumber: 242,
                developer: "Ashish",
                message: [
                    {
                        messageCode: "PRT20024",
                        messageKey: "OPERATIONAL_ATTRIBUTE_ALREADY_EXISTS",
                        messageType: "Error",
                        message: "Operational attribute already exists for this part.",
                        category: "PARTS",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 242:
            msgobj = {
                messageBuildNumber: 243,
                developer: "Ashish",
                message: [
                    {
                        messageCode: "PRT40020",
                        messageKey: "COMPONENT_CREATE_ASSEMBLY_REVISION_CONFIRMATION_MESSAGE",
                        messageType: "Confirmation",
                        message: "Are you sure to create assembly revision? Press Yes to Continue.",
                        category: "PARTS",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 243:
            msgobj = {
                messageBuildNumber: 244,
                developer: "Ashish",
                message: [
                    {
                        messageCode: "GLB40013",
                        messageKey: "STANDARD_CHANGE_CONFIRMATION_MESSAGE",
                        messageType: "Confirmation",
                        message: "{0} has been modified. Press Yes to Continue.",
                        category: "GLOBAL",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 244:
            msgobj = {
                messageBuildNumber: 245,
                developer: "Ashish",
                message: [
                    {
                        messageCode: "GLB40014",
                        messageKey: "SAVE_CUSTOMER_LOA_PRICE_CONFIRMATION_BODY_MESSAGE",
                        messageType: "Confirmation",
                        message: "Are you sure to save LOA price? Press Yes to Continue.",
                        category: "GLOBAL",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 245:
            msgobj = {
                messageBuildNumber: 246,
                developer: "Shubham",
                message: [
                    {
                        messageCode: "MFG20011",
                        messageKey: "TO_SERIAL_NOT_VALID",
                        messageType: "Error",
                        message: "To serial# is not smaller than from serial#.",
                        category: "MFG",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 246:
            msgobj = {
                messageBuildNumber: 247,
                developer: "Shubham",
                message: [
                    {
                        messageCode: "MFG20012",
                        messageKey: "NOT_MORE_THAN_ISSUEQTY",
                        messageType: "Error",
                        message: "Total quantity should not be more than issue quantity.",
                        category: "MFG",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 247:
            msgobj = {
                messageBuildNumber: 248,
                developer: "Shubham",
                message: [
                    {
                        messageCode: "MFG20013",
                        messageKey: "ADD_PROPER_DETAILS_TO_FILTER_FIRSTPICE_SERIALS",
                        messageType: "Error",
                        message: "Please add proper details to filter serials.",
                        category: "MFG",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 248:
            msgobj = {
                messageBuildNumber: 249,
                developer: "Shubham",
                message: [
                    {
                        messageCode: "MFG20014",
                        messageKey: "NO_MATCHING_WORKORDER_SERIAL_FOUND",
                        messageType: "Error",
                        message: "No matching work order serial is found.",
                        category: "MFG",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 249:
            msgobj = {
                messageBuildNumber: 250,
                developer: "Dharmishtha",
                message: [
                    {
                        messageCode: "RCV10001",
                        messageKey: "RETURN_KIT_SUCCESS",
                        messageType: "Success",
                        message: "Kit returns successfully",
                        category: "RECEIVING",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 250:
            msgobj = {
                messageBuildNumber: 251,
                developer: "Dharmishtha",
                message: [
                    {
                        messageCode: "RCV40002",
                        messageKey: "RETURN_KIT_CONFIRM",
                        messageType: "Confirmation",
                        message: "Are you sure you want to return kit?",
                        category: "RECEIVING",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 251:
            msgobj = {
                messageBuildNumber: 252,
                developer: "Dharmishtha",
                message: [
                    {
                        messageCode: "RCV20001",
                        messageKey: "NOT_ALLOW_RETURN_KIT_FOR_ALLOCATED_UMID",
                        messageType: "Error",
                        message: "You cannot return kit as inventory allocated to this kit.",
                        category: "RECEIVING",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 252:
            msgobj = {
                messageBuildNumber: 253,
                developer: "Dharmesh",
                message: [
                    {
                        messageCode: "RCV30006",
                        messageKey: "BIN_UNIQUE",
                        messageType: "Warning",
                        message: "{0} <b>{1}</b> is already exists.",
                        category: "RECEIVING",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 253:
            msgobj = {
                messageBuildNumber: 254,
                developer: "Dharmesh",
                message: [
                    {
                        messageCode: "RCV20002",
                        messageKey: "CART_BIN_NOT_DELETE_ALERT",
                        messageType: "Error",
                        message: "You cannot delete bins of <b>Smart Cart</b>. Please check selected records.",
                        category: "RECEIVING",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 254:
            msgobj = {
                messageBuildNumber: 255,
                developer: "Dharmesh",
                message: [
                    {
                        messageCode: "RCV40003",
                        messageKey: "BIN_COUNT",
                        messageType: "Confirmation",
                        message: "Total {0} bin(s) will be generated. Are you sure? Press Yes to continue.",
                        category: "RECEIVING",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 255:
            msgobj = {
                messageBuildNumber: 256,
                developer: "Dharmesh",
                message: [
                    {
                        messageCode: "RCV30007",
                        messageKey: "USE_BIN_IN_OTHER",
                        messageType: "Warning",
                        message: "Cannot inactive Bin because it is in use.",
                        category: "RECEIVING",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 256:
            msgobj = {
                messageBuildNumber: 257,
                developer: "Dharmesh",
                message: [
                    {
                        messageCode: "RCV20003",
                        messageKey: "FIRST_ACTIVE_WH",
                        messageType: "Error",
                        message: "You can not Active bin as it's warehouse is Inactive.",
                        category: "RECEIVING",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 257:
            msgobj = {
                messageBuildNumber: 258,
                developer: "Dharmesh",
                message: [
                    {
                        messageCode: "RCV30008",
                        messageKey: "IPADDRESS_UNIQUE",
                        messageType: "Warning",
                        message: "IP Address, Host Name and Model Name (For USB configuration) must be unique.",
                        category: "RECEIVING",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 258:
            msgobj = {
                messageBuildNumber: 259,
                developer: "Ashish",
                message: [
                    {
                        messageCode: "PRT40021",
                        messageKey: "COMPONENT_COPY_ASSEMBLY_DETAILS_CONFIRMATION_MESSAGE",
                        messageType: "Confirmation",
                        message: "Are you sure to copy part details? Press Yes to Continue.",
                        category: "PARTS",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 259:
            msgobj = {
                messageBuildNumber: 260,
                developer: "Ashish",
                message: [
                    {
                        messageCode: "PRT20025",
                        messageKey: "COMPONENT_COPY_ASSEMBLY_SELECT_FROM_PART_VALIDATION",
                        messageType: "Error",
                        message: "Please first select Copy From Part.",
                        category: "PARTS",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 260:
            msgobj = {
                messageBuildNumber: 261,
                developer: "Ashish",
                message: [
                    {
                        messageCode: "PRT20026",
                        messageKey: "CREATE_ASSEMBLY_REVISION_SELECT_DETAIL_BODY_MESSAGE",
                        messageType: "Error",
                        message: "Please select details to copy.",
                        category: "PARTS",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 261:
            msgobj = {
                messageBuildNumber: 262,
                developer: "Ashish",
                message: [
                    {
                        messageCode: "PRT20027",
                        messageKey: "COMPONENT_ACCEPTABLE_SHIPPING_COUNTRY_ALREADY_EXISTS",
                        messageType: "Error",
                        message: "Acceptable shipping country already exists for this part.",
                        category: "PARTS",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 262:
            msgobj = {
                messageBuildNumber: 263,
                developer: "Shweta",
                message: [
                    {
                        messageCode: "GLB20018",
                        messageKey: "DIGIKEY_AUTH_FAILED",
                        messageType: "Error",
                        message: "Authentication failed, Please try again.",
                        category: "GLOBAL",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 263:
            msgobj = {
                messageBuildNumber: 264,
                developer: "Shweta",
                message: [
                    {
                        messageCode: "MST50012",
                        messageKey: "WHO_BOUGHT_WHO_ALREADY_BUY",
                        messageType: "Information",
                        message: "{0} is already aquired by {1}.",
                        category: "MASTER",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 264:
            msgobj = {
                messageBuildNumber: 265,
                developer: "Shweta",
                message: [
                    {
                        messageCode: "MST20013",
                        messageKey: "DYNAMIC_INVALID",
                        messageType: "Error",
                        message: "<b>{0}</b> Invalid!",
                        category: "MASTER",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 265:
            msgobj = {
                messageBuildNumber: 266,
                developer: "Shweta",
                message: [
                    {
                        messageCode: "MST40006",
                        messageKey: "SET_MFG_AS_CUSTOMER_TOO",
                        messageType: "Confirmation",
                        message: "Are you sure want to set selected manufacturer as customer too?",
                        category: "MASTER",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 266:
            msgobj = {
                messageBuildNumber: 267,
                developer: "Shweta",
                message: [
                    {
                        messageCode: "MST40007",
                        messageKey: "WANT_TO_EDIT_RECORD",
                        messageType: "Confirmation",
                        message: "Would you like to update information?",
                        category: "MASTER",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 267:
            msgobj = {
                messageBuildNumber: 268,
                developer: "Fenil",
                message: [
                    {
                        messageCode: "RCV50001",
                        messageKey: "RE_CALCULATE_INTERNALVERSIO",
                        messageType: "Information",
                        message: "Internal Version are mismatch due to changes in BOM. Current version of BOM is <b>{0}</b> and Kit Allocation version is <b>{1}</b>. Please click on Recalculate button to apply changes in Kit Allocation.",
                        category: "RECEIVING",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 268:
            msgobj = {
                messageBuildNumber: 269,
                developer: "Fenil",
                message: [
                    {
                        messageCode: "RCV50002",
                        messageKey: "RE_CALCULATE_KITQTY",
                        messageType: "Information",
                        message: "You have made some changes in <b>Sales Order</b> or <b>Kit Quantity</b> or <b>MRP Quantity</b> of Sales Order# <b>{0}</b>. Please click on Recalculate button to apply changes in Kit Allocation.",
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
                developer: "Fenil",
                message: [
                    {
                        messageCode: "RCV50003",
                        messageKey: "RE_CALCULATE_DELETE_ASSY",
                        messageType: "Information",
                        message: "You have delete assembly of Sales Order# <b>{0}</b>. Please do continue to apply changes in Kit Allocation.",
                        category: "RECEIVING",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 270:
            msgobj = {
                messageBuildNumber: 271,
                developer: "Fenil",
                message: [
                    {
                        messageCode: "RCV50004",
                        messageKey: "RE_CALCULATE_CHANGE_SALESORDER",
                        messageType: "Information",
                        message: "You have made some changes in <b>Sales Order</b> or <b>Kit Quantity</b> or <b>MRP Quantity</b> of Sales Order# <b>{0}</b> from sales order screen. Please do continue to apply changes in Kit Allocation.",
                        category: "RECEIVING",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 271:
            msgobj = {
                messageBuildNumber: 272,
                developer: "Fenil",
                message: [
                    {
                        messageCode: "RCV20004",
                        messageKey: "RESERVE_FOR_CUSTOMER",
                        messageType: "Error",
                        message: "UMID <b>{0}</b> is reserve for customer <b>{1}</b>. So, you cannot allocate to customer <b>{2}</b>.",
                        category: "RECEIVING",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 272:
            msgobj = {
                messageBuildNumber: 273,
                developer: "Fenil",
                message: [
                    {
                        messageCode: "RCV20005",
                        messageKey: "RESERVE_FOR_ASSY",
                        messageType: "Error",
                        message: "UMID <b>{0}</b> is reserve for assembly <b>{1}</b>. So, you cannot allocate to assembly <b>{2}</b>.",
                        category: "RECEIVING",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 273:
            msgobj = {
                messageBuildNumber: 274,
                developer: "Fenil",
                message: [
                    {
                        messageCode: "RCV20006",
                        messageKey: "PART_NOT_POPULATE",
                        messageType: "Error",
                        message: "MFR PN does not populate in BOM. So, you cannot allocate to kit.",
                        category: "RECEIVING",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 274:
            msgobj = {
                messageBuildNumber: 275,
                developer: "Fenil",
                message: [
                    {
                        messageCode: "RCV20007",
                        messageKey: "BOM_LINE_NOT_CLEAN",
                        messageType: "Error",
                        message: "Assembly <b>{0}'s</b> BOM line no <b>{1}</b> is not clean. So, you cannot allocate UMID into kit.",
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
                developer: "Fenil",
                message: [
                    {
                        messageCode: "RCV20008",
                        messageKey: "INCORRECT_PID",
                        messageType: "Error",
                        message: "PID <b>{0}</b> is incorrect part.",
                        category: "RECEIVING",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 276:
            msgobj = {
                messageBuildNumber: 277,
                developer: "Fenil",
                message: [
                    {
                        messageCode: "RCV20009",
                        messageKey: "MFR_RESTRICTED_PART",
                        messageType: "Error",
                        message: "PID <b>{0}</b> was <b>{1}</b> at the part master level.",
                        category: "RECEIVING",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 277:
            msgobj = {
                messageBuildNumber: 278,
                developer: "Fenil",
                message: [
                    {
                        messageCode: "RCV20010",
                        messageKey: "MFR_RESTRICTED_PACKAGING_PART",
                        messageType: "Error",
                        message: "PID <b>{0}</b> was <b>{1}</b> at the part master level.",
                        category: "RECEIVING",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 278:
            msgobj = {
                messageBuildNumber: 279,
                developer: "Fenil",
                message: [
                    {
                        messageCode: "RCV20011",
                        messageKey: "CPN_PERMISSION_PART_NOT_CUSTOMER_APPROVE",
                        messageType: "Error",
                        message: "CPN <b>{0}</b> is <b>{1}</b> at part master level, but did not get customer approval at the BOM level. <br />So you cannot allocate in kit.",
                        category: "RECEIVING",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 279:
            msgobj = {
                messageBuildNumber: 280,
                developer: "Fenil",
                message: [
                    {
                        messageCode: "RCV20012",
                        messageKey: "PART_RESTRICT_IN_BOM",
                        messageType: "Error",
                        message: "CPN <b>{0}</b> has been <b>Restrict use in BOM</b>.<br/>Thus, you cannot allocate to this assembly.",
                        category: "RECEIVING",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 280:
            msgobj = {
                messageBuildNumber: 281,
                developer: "Fenil",
                message: [
                    {
                        messageCode: "RCV20013",
                        messageKey: "PART_RESTRICT_PACKAGING_IN_BOM",
                        messageType: "Error",
                        message: "PID <b>{0}</b> has been <b>Restricted Use Excluding Packaging Alias With Permanently</b>.<br/>Thus, you cannot allocate to this assembly.",
                        category: "RECEIVING",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 281:
            msgobj = {
                messageBuildNumber: 282,
                developer: "Fenil",
                message: [
                    {
                        messageCode: "RCV20014",
                        messageKey: "CPN_PART_RESTRICT_IN_BOM",
                        messageType: "Error",
                        message: "CPN <b>{0}</b> has been <b>Restrict use in BOM</b>.<br/>Thus, you cannot allocate to this assembly.",
                        category: "RECEIVING",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 282:
            msgobj = {
                messageBuildNumber: 283,
                developer: "Fenil",
                message: [
                    {
                        messageCode: "RCV20015",
                        messageKey: "PERMISSION_PART_NOT_CUSTOMER_APPROVE",
                        messageType: "Error",
                        message: "PID <b>{0}</b> is <b>{1}</b> at part master level, but did not get customer approval at the BOM level. <br />So you cannot allocate in kit.",
                        category: "RECEIVING",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 283:
            msgobj = {
                messageBuildNumber: 284,
                developer: "Fenil",
                message: [
                    {
                        messageCode: "RCV20016",
                        messageKey: "CPN_PERMISSION_PART_NOT_CUSTOMER_APPROVE_UPDATE",
                        messageType: "Error",
                        message: "CPN <b>{0}</b> is <b>{1}</b> at part master level, but did not get customer approval at the BOM level. <br />So you cannot allocate in kit.",
                        category: "RECEIVING",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 284:
            msgobj = {
                messageBuildNumber: 285,
                developer: "Fenil",
                message: [
                    {
                        messageCode: "RCV50005",
                        messageKey: "PART_RESTRICT_WITH_PERMISSION_IN_BOM",
                        messageType: "Information",
                        message: "PID <b>{0}</b> has been <b>Restricted With Permission</b> at BOM level.",
                        category: "RECEIVING",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 285:
            msgobj = {
                messageBuildNumber: 286,
                developer: "Fenil",
                message: [
                    {
                        messageCode: "RCV50006",
                        messageKey: "PART_RESTRICT_PACKAGING_IN_BOM_PERMISSION",
                        messageType: "Information",
                        message: "PID <b>{0}</b> has been <b>Restricted Use Excluding Packaging Alias With Permission</b>.<br/>Thus, you cannot allocate to this assembly.",
                        category: "RECEIVING",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 286:
            msgobj = {
                messageBuildNumber: 287,
                developer: "Fenil",
                message: [
                    {
                        messageCode: "RCV50007",
                        messageKey: "FILL_DETAIL_FOR_KIT_ALLOCATION",
                        messageType: "Information",
                        message: "<br/> Please fill the User ID, Password and Reason for give permission to allocate in kit.",
                        category: "RECEIVING",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 287:
            msgobj = {
                messageBuildNumber: 288,
                developer: "Fenil",
                message: [
                    {
                        messageCode: "RCV40006",
                        messageKey: "CONFIRMATION_FOR_STOCK_ALLOCATION",
                        messageType: "Confirmation",
                        message: "Allocating units are more than shortage per build. <br/> Are you sure you want to allocate stock?",
                        category: "RECEIVING",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 288:
            msgobj = {
                messageBuildNumber: 289,
                developer: "Fenil",
                message: [
                    {
                        messageCode: "RCV40007",
                        messageKey: "SAME_UMID_ALLOCATED",
                        messageType: "Confirmation",
                        message: "Same UMID <b>{0}</b> is already allocated. <br/> Are you sure you want to allocate same UMID in this kit?",
                        category: "RECEIVING",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 289:
            msgobj = {
                messageBuildNumber: 290,
                developer: "Fenil",
                message: [
                    {
                        messageCode: "RCV20021",
                        messageKey: "STOCK_NOT_ALLOCATED",
                        messageType: "Error",
                        message: "This UMID(s) <b>{0}</b> could not be allocated, because other UMID(s) is already allocated in this kit and shared with other kit(s). <br/> To allocate this UMID(s) into this kit, please do deallocate UMID(s) from existing kit <b>{1}</b>.",
                        category: "RECEIVING",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 290:
            msgobj = {
                messageBuildNumber: 291,
                developer: "Fenil",
                message: [
                    {
                        messageCode: "RCV40008",
                        messageKey: "DEALLOCATE_UMID_CONFIRMATION",
                        messageType: "Confirmation",
                        message: "Are you sure you want to deallocate this UMID?",
                        category: "RECEIVING",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 291:
            msgobj = {
                messageBuildNumber: 292,
                developer: "Fenil",
                message: [
                    {
                        messageCode: "RCV20022",
                        messageKey: "INOAUTO_DEPARTMENT_VALIDATION",
                        messageType: "Error",
                        message: "Your current session default department set as <b>{0}</b> department and selected UMID's belongs to different department. Either do company level search or transfer all UMID's to <b>{0}</b> department.",
                        category: "RECEIVING",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 292:
            msgobj = {
                messageBuildNumber: 293,
                developer: "Fenil",
                message: [
                    {
                        messageCode: "RCV20023",
                        messageKey: "PROMPT_ALREADY_USE",
                        messageType: "Error",
                        message: "Prompt already in use.",
                        category: "RECEIVING",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 293:
            msgobj = {
                messageBuildNumber: 294,
                developer: "Fenil",
                message: [
                    {
                        messageCode: "RCV20024",
                        messageKey: "INOAUTO_UIDNOTFOUND",
                        messageType: "Error",
                        message: "Selected UMID's does not exists. Require audit process. Please contact to administrator.",
                        category: "RECEIVING",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 294:
            msgobj = {
                messageBuildNumber: 295,
                developer: "Fenil",
                message: [
                    {
                        messageCode: "RCV20025",
                        messageKey: "INOAUTO_NOTAVAILABLE",
                        messageType: "Error",
                        message: "Selected UMID's are already check-in by someone. Please try after some time.",
                        category: "RECEIVING",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 295:
            msgobj = {
                messageBuildNumber: 296,
                developer: "Fenil",
                message: [
                    {
                        messageCode: "RCV20026",
                        messageKey: "CANCEL_MANUALLY",
                        messageType: "Error",
                        message: "Checked-in request canceled manually.",
                        category: "RECEIVING",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 296:
            msgobj = {
                messageBuildNumber: 297,
                developer: "Fenil",
                message: [
                    {
                        messageCode: "RCV20027",
                        messageKey: "CANCEL_TIMEOUT",
                        messageType: "Error",
                        message: "Checked-in request Timeout.",
                        category: "RECEIVING",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 297:
            msgobj = {
                messageBuildNumber: 298,
                developer: "Dharmishtha",
                message: [
                    {
                        messageCode: "RCV40004",
                        messageKey: "OTHER_KIT_STOCK_EXISTS_WITH_KIT",
                        messageType: "Confirmation",
                        message: "Kit <b>{0}</b> is shared with other kit(s) <b>{1}</b>. Are you sure you want to transfer to <b>{2}</b>?",
                        category: "RECEIVING",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 298:
            msgobj = {
                messageBuildNumber: 299,
                developer: "Dharmishtha",
                message: [
                    {
                        messageCode: "RCV40005",
                        messageKey: "RELEASE_CONFIRMATION",
                        messageType: "Confirmation",
                        message: "This will transfer all inventory from <b>{0}</b> to <b>{1}</b>. Are you sure you want to release planned kit# <b>{2}</b>?",
                        category: "RECEIVING",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 299:
            msgobj = {
                messageBuildNumber: 300,
                developer: "Dharmishtha",
                message: [
                    {
                        messageCode: "RCV20017",
                        messageKey: "MISMATCH_KIT_ALLOCATION_QTY_PLAN_KIT_QTY",
                        messageType: "Error",
                        message: "Plan kit release quantity and kit allocation quantity is mismatch. Please correct it.",
                        category: "RECEIVING",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 300:
            msgobj = {
                messageBuildNumber: 301,
                developer: "Dharmishtha",
                message: [
                    {
                        messageCode: "RCV50008",
                        messageKey: "UMID_NOT_EXIST",
                        messageType: "Information",
                        message: "UMID <b>{0}</b> does not exist in given list.",
                        category: "RECEIVING",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 301:
            msgobj = {
                messageBuildNumber: 302,
                developer: "Dharmishtha",
                message: [
                    {
                        messageCode: "RCV50009",
                        messageKey: "UMID_BIN_NOT_MATCH",
                        messageType: "Information",
                        message: "Scanned UMID <b>{0}</b> does not exist & not any UMID listed as un-allocated from the BIN <b>{1}</b>.",
                        category: "RECEIVING",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 302:
            msgobj = {
                messageBuildNumber: 303,
                developer: "Dharmishtha",
                message: [
                    {
                        messageCode: "RCV50010",
                        messageKey: "SCAN_UID_NOT_FOUND",
                        messageType: "Information",
                        message: "Scanned UMID <b>{0}</b> not found.",
                        category: "RECEIVING",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 303:
            msgobj = {
                messageBuildNumber: 304,
                developer: "Dharmishtha",
                message: [
                    {
                        messageCode: "RCV10004",
                        messageKey: "KIT_RELEASE_SUCCESS",
                        messageType: "Success",
                        message: "Kit released sucessfully.",
                        category: "RECEIVING",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 304:
            msgobj = {
                messageBuildNumber: 305,
                developer: "Dharmesh",
                message: [
                    {
                        messageCode: "MST40008",
                        messageKey: "BARCODE_MESSAGE_LOST",
                        messageType: "Confirmation",
                        message: "Your unsaved data will be lost, Do you want to continue?",
                        category: "MASTER",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 305:
            msgobj = {
                messageBuildNumber: 306,
                developer: "Dharmesh",
                message: [
                    {
                        messageCode: "MST20014",
                        messageKey: "BARCODE_SEPARATOR_VALIDATION_MESSAGE",
                        messageType: "Error",
                        message: "Separator must be valid.",
                        category: "MASTER",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 306:
            msgobj = {
                messageBuildNumber: 307,
                developer: "Dharmesh",
                message: [
                    {
                        messageCode: "MST20015",
                        messageKey: "SEPARATOR_REQUIRED",
                        messageType: "Error",
                        message: "Separator Required!",
                        category: "MASTER",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 307:
            msgobj = {
                messageBuildNumber: 308,
                developer: "Dharmesh",
                message: [
                    {
                        messageCode: "MST20017",
                        messageKey: "BARCODE_FIRST_DELIMITER_MFGPN",
                        messageType: "Error",
                        message: "Barcode first attribute should be MFR PN.",
                        category: "MASTER",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 308:
            msgobj = {
                messageBuildNumber: 309,
                developer: "Dharmesh",
                message: [
                    {
                        messageCode: "MST20018",
                        messageKey: "BARCODE_CONTAIN_MFGPN",
                        messageType: "Error",
                        message: "MFR PN must be require in barcode attribute.",
                        category: "MASTER",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 309:
            msgobj = {
                messageBuildNumber: 310,
                developer: "Dharmesh",
                message: [
                    {
                        messageCode: "MST20019",
                        messageKey: "BARCODE_ATTRIBUTE_VALUE_REQUIRED",
                        messageType: "Error",
                        message: "Barcode {0} must be required.",
                        category: "MASTER",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 310:
            msgobj = {
                messageBuildNumber: 311,
                developer: "Dharmesh",
                message: [
                    {
                        messageCode: "MST20020",
                        messageKey: "BARCODE_DELIMITER_DUPLICATE_MESSAGE",
                        messageType: "Error",
                        message: "Barcode delimiter already exist.",
                        category: "MASTER",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 311:
            msgobj = {
                messageBuildNumber: 312,
                developer: "Dharmesh",
                message: [
                    {
                        messageCode: "MST20021",
                        messageKey: "BARCODE_DISPLAY_ORDER_DUPLICATE_MESSAGE",
                        messageType: "Error",
                        message: "Barcode delimiter display order already exist.",
                        category: "MASTER",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 312:
            msgobj = {
                messageBuildNumber: 313,
                developer: "Dharmesh",
                message: [
                    {
                        messageCode: "MST20022",
                        messageKey: "SCANNED_LABEL_NOT_MATCH",
                        messageType: "Error",
                        message: "Scanned label and rescanned label are mismatched.",
                        category: "MASTER",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;

        case 313:
            msgobj = {
                messageBuildNumber: 314,
                developer: "Dharmesh",
                message: [
                    {
                        messageCode: "MST20023",
                        messageKey: "PUBLISH_BARCODE_WITH_INVALID_FORM",
                        messageType: "Error",
                        message: "In prior to publish barcode template, you must have to fill up all required details of barcode template.",
                        category: "MASTER",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 314:
            msgobj = {
                messageBuildNumber: 315,
                developer: "Dharmesh",
                message: [
                    {
                        messageCode: "MST20024",
                        messageKey: "BARCODE_TEMPLATE_ADD_ROW_VALIDATION_MESSAGE",
                        messageType: "Error",
                        message: "Please add field identifier information first!",
                        category: "MASTER",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 315:
            msgobj = {
                messageBuildNumber: 316,
                developer: "Dharmesh",
                message: [
                    {
                        messageCode: "MST20025",
                        messageKey: "BARCODE_TEMPLATE_NAME_UNIQUE",
                        messageType: "Error",
                        message: "Barcode template name already exist.",
                        category: "MASTER",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 316:
            msgobj = {
                messageBuildNumber: 317,
                developer: "Dharmesh",
                message: [
                    {
                        messageCode: "MST20026",
                        messageKey: "BARCODE_TEMPLATE_EXPRESSION_UNIQUE",
                        messageType: "Error",
                        message: "Barcode template already exist.",
                        category: "MASTER",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 317:
            msgobj = {
                messageBuildNumber: 318,
                developer: "Dharmesh",
                message: [
                    {
                        messageCode: "RCV10002",
                        messageKey: "MATERIAL_APPROVED",
                        messageType: "Success",
                        message: "Material approved successfully.",
                        category: "RECEIVING",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 318:
            msgobj = {
                messageBuildNumber: 319,
                developer: "Dharmesh",
                message: [
                    {
                        messageCode: "RCV20018",
                        messageKey: "MATERIAL_NOT_APPROVED",
                        messageType: "Error",
                        message: "Material has not approved.",
                        category: "RECEIVING",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 319:
            msgobj = {
                messageBuildNumber: 320,
                developer: "Dharmesh",
                message: [
                    {
                        messageCode: "RCV10003",
                        messageKey: "SLIP_PAID",
                        messageType: "Success",
                        message: "Packing slip paid successfully.",
                        category: "RECEIVING",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 320:
            msgobj = {
                messageBuildNumber: 321,
                developer: "Dharmesh",
                message: [
                    {
                        messageCode: "RCV20019",
                        messageKey: "SLIP_NOT_PAID",
                        messageType: "Error",
                        message: "Packing slip payment was unsuccessful.",
                        category: "RECEIVING",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 321:
            msgobj = {
                messageBuildNumber: 322,
                developer: "Dharmesh",
                message: [
                    {
                        messageCode: "RCV20028",
                        messageKey: "PACKING_SLIP_INVOICE_STATUS_CHANGED",
                        messageType: "Error",
                        message: "You cannot {0} material detail, as status update to <b>Paid</b> from invoice.",
                        category: "RECEIVING",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 322:
            msgobj = {
                messageBuildNumber: 323,
                developer: "Dharmesh",
                message: [
                    {
                        messageCode: "RCV20029",
                        messageKey: "PACKING_SLIP_UMID_CREATED",
                        messageType: "Error",
                        message: "You cannot delete material detail(s) as UMID created.",
                        category: "RECEIVING",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 323:
            msgobj = {
                messageBuildNumber: 324,
                developer: "Dharmesh",
                message: [
                    {
                        messageCode: "RCV40009",
                        messageKey: "CONFIRMATION_PART_EXIST_WITH_SAME_PACKAGING",
                        messageType: "Confirmation",
                        message: "<b>{0}</b> is already added with the same packaging <b>{1}</b>.<br />Are you sure you want to continue?",
                        category: "RECEIVING",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 324:
            msgobj = {
                messageBuildNumber: 325,
                developer: "Dharmesh",
                message: [
                    {
                        messageCode: "RCV20030",
                        messageKey: "NOT_UPDATE_PAID_PACKING_SLIP",
                        messageType: "Error",
                        message: "You cannot update detail of <b>Paid</b> packing slip detail.",
                        category: "RECEIVING",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 325:
            msgobj = {
                messageBuildNumber: 326,
                developer: "Dharmesh",
                message: [
                    {
                        messageCode: "RCV20031",
                        messageKey: "BIN_CONTAIN_SAME_PS_PART",
                        messageType: "Error",
                        message: "Location/Bin <b>{0}</b> containing <b>{1}</b> of packing slip <b>{2} [{3}]</b>.<br /> Please select different bin.",
                        category: "RECEIVING",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;

        case 326:
            msgobj = {
                messageBuildNumber: 327,
                developer: "Dharmesh",
                message: [
                    {
                        messageCode: "RCV20032",
                        messageKey: "NOT_ALLOW_TO_REDUCE_PACKING_SLIP_QTY_THEN_UMID_QTY",
                        messageType: "Error",
                        message: "You cannot update received quantity less than UMID created quantity i.e., <b>{0}</b>.",
                        category: "RECEIVING",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;


        case 327:
            msgobj = {
                messageBuildNumber: 328,
                developer: "Dharmesh",
                message: [
                    {
                        messageCode: "RCV20033",
                        messageKey: "UMID_CREATED_NOT_CHANGE_PACKAGING",
                        messageType: "Error",
                        message: "UMID was already created for packing slip line# <b>{0}</b>, So you cannot change the packaging.",
                        category: "RECEIVING",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;

        case 328:
            msgobj = {
                messageBuildNumber: 329,
                developer: "Dharmesh",
                message: [
                    {
                        messageCode: "RCV20034",
                        messageKey: "PACKING_SLIP_NOT_DELETE_APPROVED",
                        messageType: "Error",
                        message: "You cannot delete approved/paid packing slip detail.",
                        category: "RECEIVING",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;

        case 329:
            msgobj = {
                messageBuildNumber: 330,
                developer: "Dharmesh",
                message: [
                    {
                        messageCode: "RCV20035",
                        messageKey: "MISMATCH_SUPPLIER",
                        messageType: "Error",
                        message: "Supplier PN <b>{0}</b> does not belong from the Selected supplier <b>{1}</b>.",
                        category: "RECEIVING",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;

        case 330:
            msgobj = {
                messageBuildNumber: 331,
                developer: "Dharmesh",
                message: [
                    {
                        messageCode: "RCV30009",
                        messageKey: "PACKING_SLIP_UNIQUE",
                        messageType: "Warning",
                        message: "This {0}# <b>{1}</b> is already exists for supplier <b>{2}</b>. Please enter unique {3}.",
                        category: "RECEIVING",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;

        case 331:
            msgobj = {
                messageBuildNumber: 332,
                developer: "Dharmesh",
                message: [
                    {
                        messageCode: "RCV20036",
                        messageKey: "MFRPN_BAD_PART",
                        messageType: "Error",
                        message: "PID <b>{0}</b> has been defined as an <b>{1}</b> in part master, You cannot receive this part.",
                        category: "RECEIVING",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;

        case 332:
            msgobj = {
                messageBuildNumber: 333,
                developer: "Dharmesh",
                message: [
                    {
                        messageCode: "RCV50011",
                        messageKey: "PID_RECTRICTED_WITH_PERMISION",
                        messageType: "Information",
                        message: "PID <b>{0}</b> has been <b>{1}</b> at the part master level.",
                        category: "RECEIVING",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;


        case 333:
            msgobj = {
                messageBuildNumber: 334,
                developer: "Dharmesh",
                message: [
                    {
                        messageCode: "RCV50012",
                        messageKey: "PID_RECTRICTED_PACKAGING_WITH_PERMISION",
                        messageType: "Information",
                        message: "PID <b>{0}</b> has been <b>{1}</b> at the part master level.",
                        category: "RECEIVING",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;

        case 334:
            msgobj = {
                messageBuildNumber: 335,
                developer: "Dharmesh",
                message: [
                    {
                        messageCode: "RCV50013",
                        messageKey: "FILL_DETAIL_FOR_SLIP",
                        messageType: "Information",
                        message: "<br/> Please fill the User ID, Password and Reason to give permission.",
                        category: "RECEIVING",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;

        case 335:
            msgobj = {
                messageBuildNumber: 336,
                developer: "Dharmesh",
                message: [
                    {
                        messageCode: "RCV50014",
                        messageKey: "RE_ENTER_BIN",
                        messageType: "Information",
                        message: "Please do either Scan <b>{0}</b> name or type <b>{1}</b> name and press enter key.",
                        category: "RECEIVING",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;

        case 336:
            msgobj = {
                messageBuildNumber: 337,
                developer: "Dharmesh",
                message: [
                    {
                        messageCode: "RCV30010",
                        messageKey: "PACKING_SLIP_SO_ASSOCIATE_TO_OTHER_PO",
                        messageType: "Warning",
                        message: "This sales order <b>{0}</b> is associated with purchase order <b>{1}</b>. Please verify it.",
                        category: "RECEIVING",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 337:
            msgobj = {
                messageBuildNumber: 338,
                developer: "Champak",
                message: [
                    {
                        messageCode: "GLB40016",
                        messageKey: "STATUS_CHANGE_CONFIRMATION",
                        messageType: "Confirmation",
                        message: "Are you sure you want to change status from <b>{0}</b> to <b>{1}</b>? Press Yes to Continue.",
                        category: "GLOBAL",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;

        case 338:
            msgobj = {
                messageBuildNumber: 339,
                developer: "Dharmesh",
                message: [
                    {
                        messageCode: "RCV20037",
                        messageKey: "NOT_PAID",
                        messageType: "Error",
                        message: "From selected records some records are not approved or already paid. Please check selected records.",
                        category: "RECEIVING",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;



        case 339:
            msgobj = {
                messageBuildNumber: 340,
                developer: "Dharmesh",
                message: [
                    {
                        messageCode: "RCV20038",
                        messageKey: "NOT_PAID_OTHER_SUPPLIER",
                        messageType: "Error",
                        message: "From selected records some records are other supplier. Please check selected records.",
                        category: "RECEIVING",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;

        case 340:
            msgobj = {
                messageBuildNumber: 341,
                developer: "Dharmesh",
                message: [
                    {
                        messageCode: "RCV20039",
                        messageKey: "NOT_PACKING_INVOICE",
                        messageType: "Error",
                        message: "From selected records not any record as a packing invoice.Please check selected records.",
                        category: "RECEIVING",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;

        case 341:
            msgobj = {
                messageBuildNumber: 342,
                developer: "Dharmesh",
                message: [
                    {
                        messageCode: "RCV20040",
                        messageKey: "RECORDS_APPROVE_TO_PAY",
                        messageType: "Error",
                        message: "You can not delete that record(s), as from selected record(s) some record(s) line detail's status is <b>Approve To Pay</b>.",
                        category: "RECEIVING",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 342:
            msgobj = {
                messageBuildNumber: 343,
                developer: "Dharmesh",
                message: [
                    {
                        messageCode: "RCV50015",
                        messageKey: "RE_GET_PACKING_SLIP_LINE",
                        messageType: "Information",
                        message: "In packing slip# <b>{0}</b> have added <b>{1}</b> new line(s) and removed <b>{2}</b> line(s). <br /> So, Please press <b>REGET INVOICE DETAIL</b> button to get updated invoice details.",
                        category: "RECEIVING",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;

        case 343:
            msgobj = {
                messageBuildNumber: 344,
                developer: "Dharmesh",
                message: [
                    {
                        messageCode: "RCV20041",
                        messageKey: "PACKING_SLIP_NOT_FOUND",
                        messageType: "Error",
                        message: "Packing slip# <b>{0}</b> not found.",
                        category: "RECEIVING",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 344:
            msgobj = {
                messageBuildNumber: 345,
                developer: "Dharmesh",
                message: [
                    {
                        messageCode: "RCV20042",
                        messageKey: "SUPPLIER_INVOICE_ALREADY_CREATED",
                        messageType: "Error",
                        message: "Packing slip# <b>{0}'s</b> supplier invoice is already created for supplier <b>{1}</b>.",
                        category: "RECEIVING",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 345:
            msgobj = {
                messageBuildNumber: 346,
                developer: "Dharmesh",
                message: [
                    {
                        messageCode: "RCV20043",
                        messageKey: "PACKING_SLIP_NOT_DETAIL_LINE",
                        messageType: "Error",
                        message: "Packing slip# <b>{0}</b> don't have single line of material details. So you cannot get any detail of packing slip.",
                        category: "RECEIVING",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 346:
            msgobj = {
                messageBuildNumber: 347,
                developer: "Dharmesh",
                message: [
                    {
                        messageCode: "RCV20044",
                        messageKey: "SAVE_INVOICE_LINE_DETAIL",
                        messageType: "Error",
                        message: "Please save invoice detail.",
                        category: "RECEIVING",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 347:
            msgobj = {
                messageBuildNumber: 348,
                developer: "Dharmesh",
                message: [
                    {
                        messageCode: "RCV20045",
                        messageKey: "NOT_ALLOW_CHANGE_MEMO",
                        messageType: "Error",
                        message: "In <b>{0}</b> did not allow to change detail of {0}.",
                        category: "RECEIVING",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;

        case 348:
            msgobj = {
                messageBuildNumber: 349,
                developer: "Dharmesh",
                message: [
                    {
                        messageCode: "RCV20046",
                        messageKey: "ALREADY_VERIFIED",
                        messageType: "Error",
                        message: "You can not change detail of <b>Paid</b> invoice.",
                        category: "RECEIVING",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 349:
            msgobj = {
                messageBuildNumber: 350,
                developer: "Dharmesh",
                message: [
                    {
                        messageCode: "RCV20047",
                        messageKey: "LINE_ITEM_NOT_FOUND",
                        messageType: "Error",
                        message: "Invoice line# not found in invoice detail.",
                        category: "RECEIVING",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 350:
            msgobj = {
                messageBuildNumber: 351,
                developer: "Dharmesh",
                message: [
                    {
                        messageCode: "RCV20048",
                        messageKey: "UPDATE_INVOICE_PRICE",
                        messageType: "Error",
                        message: "Invoice price must be greater than 0.",
                        category: "RECEIVING",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 351:
            msgobj = {
                messageBuildNumber: 352,
                developer: "Dharmesh",
                message: [
                    {
                        messageCode: "RCV20049",
                        messageKey: "UPDATE_PURCHASE_PRICE",
                        messageType: "Error",
                        message: "Purchase price must be greater than 0.",
                        category: "RECEIVING",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 352:
            msgobj = {
                messageBuildNumber: 353,
                developer: "Dharmesh",
                message: [
                    {
                        messageCode: "RCV20050",
                        messageKey: "COMPANY_CONFIGURATION_SET",
                        messageType: "Error",
                        message: "Default company configuration is not done yet, please configure first from manufacture master.",
                        category: "RECEIVING",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 353:
            msgobj = {
                messageBuildNumber: 354,
                developer: "Dharmesh",
                message: [
                    {
                        messageCode: "RCV40010",
                        messageKey: "MERGE_MEMO",
                        messageType: "Confirmation",
                        message: "For line# <b>{0}</b> already {1}# <b>{2}</b> is created. If you add this line into old {1} then this line will merger with old debit memo line. <br />Are you sure you want to add this line in old {1}?",
                        category: "RECEIVING",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;

        case 354:
            msgobj = {
                messageBuildNumber: 355,
                developer: "Dharmesh",
                message: [
                    {
                        messageCode: "RCV20041",
                        messageKey: "SHOW_DEBIT_MEMO_NUMBER",
                        messageType: "Information",
                        message: "Debit memo <b>{0}</b> is generated successfully.",
                        category: "RECEIVING",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;

        case 355:
            msgobj = {
                messageBuildNumber: 356,
                developer: "Dharmesh",
                message: [
                    {
                        messageCode: "GLB20019",
                        messageKey: "DownloadFileErrorMsg_NOCONTENT",
                        messageType: "Error",
                        message: "Records Not found.",
                        category: "GLOBAL",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 356:
            msgobj = {
                messageBuildNumber: 357,
                developer: "Dharmesh",
                message: [
                    {
                        messageCode: "GLB20020",
                        messageKey: "DownloadFileErrorMsg_SERVICEUNAVAILABLE",
                        messageType: "Error",
                        message: "Report service is unavailable.Please contact administrator.",
                        category: "GLOBAL",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 357:
            msgobj = {
                messageBuildNumber: 358,
                developer: "Dharmesh",
                message: [
                    {
                        messageCode: "RCV20051",
                        messageKey: "MISMATCH_AMOUNT",
                        messageType: "Error",
                        message: "Payment amount is mismatch with selected item total.",
                        category: "RECEIVING",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 358:
            msgobj = {
                messageBuildNumber: 359,
                developer: "Fenil",
                message: [
                    {
                        messageCode: "RCV20054",
                        messageKey: "PACAKGING_RECEIVE_QTY_NOT_MATCH",
                        messageType: "Error",
                        message: "Receiving qty does not match with packaging qty. Please select correct packaging.",
                        category: "RECEIVING",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 359:
            msgobj = {
                messageBuildNumber: 360,
                developer: "Ashish",
                message: [
                    {
                        messageCode: "RFQ40002",
                        messageKey: "BOM_STOP_FROM_RFQ_LIST_MESSAGE",
                        messageType: "Confirmation",
                        message: "BOM activity will be stop for assembly <b>{0}</b>. Are you sure want to continue?",
                        category: "RFQ",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 360:
            msgobj = {
                messageBuildNumber: 361,
                developer: "Ashish",
                message: [
                    {
                        messageCode: "RFQ40003",
                        messageKey: "BOM_STOP_BY_SA_FROM_RFQ_LIST_MESSAGE",
                        messageType: "Confirmation",
                        message: "Are you sure you want to stop the <b>{0}</b> User BOM activity of <b>{1}</b>?<br/><b>{2}</b> User active session unsaved work will autosave if any. Press yes to continue.",
                        category: "RFQ",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 361:
            msgobj = {
                messageBuildNumber: 362,
                developer: "Ashish",
                message: [
                    {
                        messageCode: "RFQ20003",
                        messageKey: "BOM_DIFFERENT_USER_STOP_MESSAGE",
                        messageType: "Error",
                        message: "You cannot stop the BOM activity of different user, Please contact to <b>{0}</b>.",
                        category: "RFQ",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 362:
            msgobj = {
                messageBuildNumber: 363,
                developer: "Dharmesh",
                message: [
                    {
                        messageCode: "RCV20052",
                        messageKey: "RESTRICT_MISMATCH",
                        messageType: "Error",
                        message: "UMID <b>{0}</b> is already <b>{1}</b>.",
                        category: "RECEIVING",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;


        case 363:
            msgobj = {
                messageBuildNumber: 364,
                developer: "Dharmesh",
                message: [
                    {
                        messageCode: "RCV20053",
                        messageKey: "SCAN_VALID_UMID",
                        messageType: "Error",
                        message: "Please enter or scan valid UMID.",
                        category: "RECEIVING",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 364:
            msgobj = {
                messageBuildNumber: 365,
                developer: "Dharmesh",
                message: [
                    {
                        messageCode: "RCV10005",
                        messageKey: "SAVE_RESTRICT_UMID",
                        messageType: "Success",
                        message: "UMID {0} successfully.",
                        category: "RECEIVING",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 365:
            msgobj = {
                messageBuildNumber: 366,
                developer: "Dharmesh",
                message: [
                    {
                        messageCode: "RCV40011",
                        messageKey: "USE_IN_KIT",
                        messageType: "Confirmation",
                        message: "UMID <b>{0}</b> is allocated in kit <b>{1}</b>. <br />So, system will auto deallocated from this Kit. <br />Are you sure you want to restrict this UMID?",
                        category: "RECEIVING",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;

        case 366:
            msgobj = {
                messageBuildNumber: 367,
                developer: "Dharmesh",
                message: [
                    {
                        messageCode: "RCV20055",
                        messageKey: "USE_IN_EQUIPMENT_RESTRICT",
                        messageType: "Error",
                        message: "Currently, this UMID <b>{0}</b> is used in the feeder <b>#BINNAME#</b>. To restrict it, first remove from the equipement's feeder.",
                        category: "RECEIVING",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;

        case 367:
            msgobj = {
                messageBuildNumber: 368,
                developer: "Dharmesh",
                message: [
                    {
                        messageCode: "RCV40012",
                        messageKey: "LOSE_IMAGE",
                        messageType: "Confirmation",
                        message: "You will lose captured image. Are you sure you want to discard captured image?",
                        category: "RECEIVING",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 368:
            msgobj = {
                messageBuildNumber: 369,
                developer: "Dharmesh",
                message: [
                    {
                        messageCode: "RCV20056",
                        messageKey: "INITIAL_COUNT_GREATER_THAN_CONSUMED",
                        messageType: "Error",
                        message: "Initial count <b>({0})</b> must be greater than consumed count <b>({1})</b>.",
                        category: "RECEIVING",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;

        case 369:
            msgobj = {
                messageBuildNumber: 370,
                developer: "Dharmesh",
                message: [
                    {
                        messageCode: "RCV20057",
                        messageKey: "BIN_NOT_HAVE_STOCK",
                        messageType: "Error",
                        message: "<b>{0}</b> bin have <b>#binqty#</b> qty of <b>{1}</b> part and you are generating UMID of <b>#creatingqty#</b> qty for <b>{2}</b> part.",
                        category: "RECEIVING",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 370:
            msgobj = {
                messageBuildNumber: 371,
                developer: "Shweta",
                message: [
                    {
                        messageCode: "MST20016",
                        messageKey: "STANDARD_TYPE_ERROR",
                        messageType: "Error",
                        message: "Standard type is not selected.",
                        category: "MASTER",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 371:
            msgobj = {
                messageBuildNumber: 372,
                developer: "Shweta",
                message: [
                    {
                        messageCode: "MST40009",
                        messageKey: "CERTIFICATE_STANDARD_IMAGE_DELETE_CONFIRMATION_MESSAGE",
                        messageType: "Confirmation",
                        message: "Are you sure want to delete Standard image? Press Yes to Continue.",
                        category: "MASTER",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 372:
            msgobj = {
                messageBuildNumber: 373,
                developer: "Shweta",
                message: [
                    {
                        messageCode: "MST30005",
                        messageKey: "STANDARD_CLASSNAME_UNIQUE",
                        messageType: "Warning",
                        message: "Standard category name should be unique.",
                        category: "MASTER",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 373:
            msgobj = {
                messageBuildNumber: 374,
                developer: "Shweta",
                message: [
                    {
                        messageCode: "GLB40015",
                        messageKey: "PUBLISH_TEMPLATE_CONFIRM",
                        messageType: "Confirmation",
                        message: "Are you sure? This action will publish current template and previous template will be set as read only. Press Yes to Continue. Note: You won't be able rollback this action, make sure template is ready to publish.",
                        category: "GLOBAL",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 374:
            msgobj = {
                messageBuildNumber: 375,
                developer: "Shweta",
                message: [
                    {
                        messageCode: "MST10016",
                        messageKey: "AGREEMENT_PUBLISH_SUCCESS",
                        messageType: "Success",
                        message: "Agreement is published successfully.",
                        category: "MASTER",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 375:
            msgobj = {
                messageBuildNumber: 376,
                developer: "Shweta",
                message: [
                    {
                        messageCode: "MST20027",
                        messageKey: "AGREEMENT_NOT_PUBLISH",
                        messageType: "Success",
                        message: "Agreement could not be published.",
                        category: "MASTER",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 376:
            msgobj = {
                messageBuildNumber: 377,
                developer: "Shweta",
                message: [
                    {
                        messageCode: "GLB50016",
                        messageKey: "LOGIN_AGRREMENT_SIGN",
                        messageType: "Information",
                        message: "Please read terms and condition and acknowledge in prior to access login.",
                        category: "GLOBAL",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 377:
            msgobj = {
                messageBuildNumber: 378,
                developer: "Shweta",
                message: [
                    {
                        messageCode: "GLB20021",
                        messageKey: "USER_NAME_EMPTY",
                        messageType: "Error",
                        message: "Please enter username first.",
                        category: "GLOBAL",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 378:
            msgobj = {
                messageBuildNumber: 379,
                developer: "Shweta",
                message: [
                    {
                        messageCode: "MST30006",
                        messageKey: "USER_USERNAME_PASSWORD_INCORRECT",
                        messageType: "Warning",
                        message: "User ID or password is incorrect.",
                        category: "MASTER",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 379:
            msgobj = {
                messageBuildNumber: 380,
                developer: "Shweta",
                message: [
                    {
                        messageCode: "MST20029",
                        messageKey: "INVALID_USER",
                        messageType: "Error",
                        message: "Invalid user!!",
                        category: "MASTER",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 380:
            msgobj = {
                messageBuildNumber: 381,
                developer: "Shweta",
                message: [
                    {
                        messageCode: "MST20030",
                        messageKey: "INACTIVE_ACCOUNT",
                        messageType: "Error",
                        message: "Sorry! Account is not active. Please contact to administrator.",
                        category: "MASTER",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 381:
            msgobj = {
                messageBuildNumber: 382,
                developer: "Shweta",
                message: [
                    {
                        messageCode: "MST50015",
                        messageKey: "CHECK_MAIL_FOR_RESET_PASSWORD",
                        messageType: "Information",
                        message: "Please check your mail for reset password.",
                        category: "MASTER",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 382:
            msgobj = {
                messageBuildNumber: 383,
                developer: "Shweta",
                message: [
                    {
                        messageCode: "MST50016",
                        messageKey: "PASSWORD_RESET_LINK_EXPIRED",
                        messageType: "Information",
                        message: "Sorry! Reset password link is expired.",
                        category: "MASTER",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 383:
            msgobj = {
                messageBuildNumber: 384,
                developer: "Shweta",
                message: [
                    {
                        messageCode: "MST30007",
                        messageKey: "UNAUTHORIZE_USER",
                        messageType: "Warning",
                        message: "You are not authorized person. Please contact to superior.",
                        category: "MASTER",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 384:
            msgobj = {
                messageBuildNumber: 385,
                developer: "Shweta",
                message: [
                    {
                        messageCode: "MST50017",
                        messageKey: "USER_ALREADY_LOGIN",
                        messageType: "Information",
                        message: "You are already login!",
                        category: "MASTER",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 385:
            msgobj = {
                messageBuildNumber: 386,
                developer: "Shweta",
                message: [
                    {
                        messageCode: "MST50018",
                        messageKey: "SIGN_OUT_FIRST",
                        messageType: "Information",
                        message: "Please first sign out from your account to reset password.",
                        category: "MASTER",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 386:
            msgobj = {
                messageBuildNumber: 387,
                developer: "Shweta",
                message: [
                    {
                        messageCode: "MST10017",
                        messageKey: "USER_SETTING_UPDATED",
                        messageType: "Success",
                        message: "Settings updated successfully.",
                        category: "MASTER",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 387:
            msgobj = {
                messageBuildNumber: 388,
                developer: "Shweta",
                message: [
                    {
                        messageCode: "MST10018",
                        messageKey: "NEW_ROLE_PERMISSION_CREATED",
                        messageType: "Success",
                        message: "Role created with selected page permission.",
                        category: "MASTER",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 388:
            msgobj = {
                messageBuildNumber: 389,
                developer: "Shweta",
                message: [
                    {
                        messageCode: "MST10019",
                        messageKey: "CREATE_ROLE_PERMISION",
                        messageType: "Success",
                        message: "Role updated with selected page permission.",
                        category: "MASTER",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 389:
            msgobj = {
                messageBuildNumber: 390,
                developer: "Shweta",
                message: [
                    {
                        messageCode: "MST10020",
                        messageKey: "SAVE_ROLE",
                        messageType: "Success",
                        message: "Role saved successfully.",
                        category: "MASTER",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 390:
            msgobj = {
                messageBuildNumber: 391,
                developer: "Shweta",
                message: [
                    {
                        messageCode: "MST10021",
                        messageKey: "DELETE_ROLE",
                        messageType: "Success",
                        message: "Role deleted successfully.",
                        category: "MASTER",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 391:
            msgobj = {
                messageBuildNumber: 392,
                developer: "Shweta",
                message: [
                    {
                        messageCode: "MST10022",
                        messageKey: "FEATURE_ASSIGNED_TO_USER",
                        messageType: "Success",
                        message: "Features assigned to user successfully.",
                        category: "MASTER",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 392:
            msgobj = {
                messageBuildNumber: 393,
                developer: "Shweta",
                message: [
                    {
                        messageCode: "MST30008",
                        messageKey: "PAGE_DETAIL_UPDATION_ALERT",
                        messageType: "Warning",
                        message: "This action required personnel re-login.",
                        category: "MASTER",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 393:
            msgobj = {
                messageBuildNumber: 394,
                developer: "Shweta",
                message: [
                    {
                        messageCode: "MST10023",
                        messageKey: "PAGE_DETAIL_CREATED",
                        messageType: "Success",
                        message: "Page created successfully.",
                        category: "MASTER",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 394:
            msgobj = {
                messageBuildNumber: 395,
                developer: "Shweta",
                message: [
                    {
                        messageCode: "MST50019",
                        messageKey: "PAGE_DETAIL_NOT_UPDATED",
                        messageType: "Information",
                        message: "Page could not be updated.",
                        category: "MASTER",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 395:
            msgobj = {
                messageBuildNumber: 396,
                developer: "Shweta",
                message: [
                    {
                        messageCode: "MST10024",
                        messageKey: "PAGE_DETAIL_UPDATED",
                        messageType: "Success",
                        message: "Page updated successfully.",
                        category: "MASTER",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 396:
            msgobj = {
                messageBuildNumber: 397,
                developer: "Shweta",
                message: [
                    {
                        messageCode: "MST50020",
                        messageKey: "PAGE_DETAIL_NOT_DELETED",
                        messageType: "Information",
                        message: "Page could not be deleted.",
                        category: "MASTER",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 397:
            msgobj = {
                messageBuildNumber: 398,
                developer: "Shweta",
                message: [
                    {
                        messageCode: "MST10025",
                        messageKey: "PAGE_DETAIL_DELETED",
                        messageType: "Success",
                        message: "Page deleted successfully.",
                        category: "MASTER",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 398:
            msgobj = {
                messageBuildNumber: 399,
                developer: "Shubham",
                message: [
                    {
                        messageCode: "GLB10009",
                        messageKey: "DOCUMENT_UPLOADED",
                        messageType: "Success",
                        message: "{0} document(s) uploaded successfully.",
                        category: "GLOBAL",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 399:
            msgobj = {
                messageBuildNumber: 400,
                developer: "Shubham",
                message: [
                    {
                        messageCode: "GLB20022",
                        messageKey: "DOCUMENT_NOT_UPLOAD",
                        messageType: "Error",
                        message: "Something went wrong while uploading document. Please try again.",
                        category: "GLOBAL",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 400:
            msgobj = {
                messageBuildNumber: 401,
                developer: "Fenil",
                message: [
                    {
                        messageCode: "RCV50016",
                        messageKey: "SHELF_LIFE_UPON_PART_MASTER",
                        messageType: "Information",
                        message: "Hint: In part master set shelf life days so require to insert Date of Manufacture or Expire.",
                        category: "RECEIVING",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 401:
            msgobj = {
                messageBuildNumber: 402,
                developer: "Fenil",
                message: [
                    {
                        messageCode: "RCV50017",
                        messageKey: "SHELF_LIFE_UPON_MOUNTING_GROUP",
                        messageType: "Information",
                        message: "Hint: This part is belong in Chemical Group so require to insert Date of Manufacture or Expire.",
                        category: "RECEIVING",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 402:
            msgobj = {
                messageBuildNumber: 403,
                developer: "Fenil",
                message: [
                    {
                        messageCode: "RCV20058",
                        messageKey: "MFGDATECODE_GRETER_CUURENTDAE",
                        messageType: "Error",
                        message: "MFR label date code from reel does not allow to greater than current date.",
                        category: "RECEIVING",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;

        case 403:
            msgobj = {
                messageBuildNumber: 404,
                developer: "Shweta",
                message: [
                    {
                        messageCode: "MST40010",
                        messageKey: "CONFIRMATION_FOR_DELETE_ROLE",
                        messageType: "Confirmation",
                        message: "Are you sure you want to unsave {0} role changes?",
                        category: "MASTER",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 404:
            msgobj = {
                messageBuildNumber: 405,
                developer: "Shweta",
                message: [
                    {
                        messageCode: "MST40011",
                        messageKey: "CHANGE_PERMISSION_LOGOUT",
                        messageType: "Confirmation",
                        message: "You should require login again in all active session. Do you want to logout?",
                        category: "MASTER",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 405:
            msgobj = {
                messageBuildNumber: 406,
                developer: "Shweta",
                message: [
                    {
                        messageCode: "MST40012",
                        messageKey: "CHANGE_PERMISSION_SEND_NOTIFICATION",
                        messageType: "Confirmation",
                        message: "Person is required to re-login in all active sessions. Click \"Continue\" to save or click \"Save & send notification\" to save and notify the person.",
                        category: "MASTER",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 406:
            msgobj = {
                messageBuildNumber: 407,
                developer: "Shweta",
                message: [
                    {
                        messageCode: "GLB40017",
                        messageKey: "WITHOUT_SAVING_ALERT_BODY_MESSAGE_FOR_TAB",
                        messageType: "Confirmation",
                        message: "You will lose all unsaved role and permission changes.<br/> Are you sure you want to leave this tab?",
                        category: "GLOBAL",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 407:
            msgobj = {
                messageBuildNumber: 408,
                developer: "Shweta",
                message: [
                    {
                        messageCode: "MST40013",
                        messageKey: "WITHOUT_SAVING_ALERT_BODY_MESSAGE_FOR_ROLE",
                        messageType: "Confirmation",
                        message: "You will lose all unsaved role changes.<br/> Are you sure you want to leave this role?",
                        category: "MASTER",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 408:
            msgobj = {
                messageBuildNumber: 409,
                developer: "Shweta",
                message: [
                    {
                        messageCode: "MST50021",
                        messageKey: "OPERATION_NOT_FOUND",
                        messageType: "Information",
                        message: "Operation not Found.",
                        category: "MASTER",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 409:
            msgobj = {
                messageBuildNumber: 410,
                developer: "Shweta",
                message: [
                    {
                        messageCode: "MST10026",
                        messageKey: "OPERATION_CREATED",
                        messageType: "Success",
                        message: "Operation created successfully.",
                        category: "MASTER",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 410:
            msgobj = {
                messageBuildNumber: 411,
                developer: "Shweta",
                message: [
                    {
                        messageCode: "MST10027",
                        messageKey: "OPERATION_UPDATED",
                        messageType: "Success",
                        message: "Operation created successfully.",
                        category: "MASTER",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 411:
            msgobj = {
                messageBuildNumber: 412,
                developer: "Shweta",
                message: [
                    {
                        messageCode: "MST10028",
                        messageKey: "OPERATION_DELETED",
                        messageType: "Success",
                        message: "Operation deleted successfully.",
                        category: "MASTER",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 412:
            msgobj = {
                messageBuildNumber: 413,
                developer: "Shweta",
                message: [
                    {
                        messageCode: "MST10029",
                        messageKey: "EMPLOYEE_ADDED_TO_OPERATION",
                        messageType: "Success",
                        message: "Personnel added to operation.",
                        category: "MASTER",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 413:
            msgobj = {
                messageBuildNumber: 414,
                developer: "Shweta",
                message: [
                    {
                        messageCode: "MST10030",
                        messageKey: "EMPLOYEE_DELETED_FROM_OPERATION",
                        messageType: "Success",
                        message: "Personnel removed from operation.",
                        category: "MASTER",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 414:
            msgobj = {
                messageBuildNumber: 415,
                developer: "Shweta",
                message: [
                    {
                        messageCode: "GLB40018",
                        messageKey: "COMMON_DELETE_CONFIRMATION",
                        messageType: "Confirmations",
                        message: "{0} will be removed. Press Yes to Continue.",
                        category: "GLOBAL",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 415:
            msgobj = {
                messageBuildNumber: 416,
                developer: "Shweta",
                message: [
                    {
                        messageCode: "MST10031",
                        messageKey: "USER_DELETED",
                        messageType: "Success",
                        message: "User deleted successfully.",
                        category: "MASTER",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 416:
            msgobj = {
                messageBuildNumber: 417,
                developer: "Shweta",
                message: [
                    {
                        messageCode: "MST50022",
                        messageKey: "USER_NOT_DELETED",
                        messageType: "Information",
                        message: "User could not be deleted.",
                        category: "MASTER",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 417:
            msgobj = {
                messageBuildNumber: 418,
                developer: "Shweta",
                message: [
                    {
                        messageCode: "MST30009",
                        messageKey: "OPERATION_STATUS_CHANGE",
                        messageType: "Warning",
                        message: "In prior to publish operation, you must have to fill up all required details of operation.",
                        category: "MASTER",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 418:
            msgobj = {
                messageBuildNumber: 419,
                developer: "Shweta",
                message: [
                    {
                        messageCode: "MST40014",
                        messageKey: "OP_STATUS_CHANGE",
                        messageType: "Confirmation",
                        message: "Operation status will be changed from {0} to {1}, Press Yes to Continue.",
                        category: "MASTER",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;

        case 419:
            msgobj = {
                messageBuildNumber: 420,
                developer: "Dharmesh",
                message: [
                    {
                        messageCode: "RCV20059",
                        messageKey: "SCAN_VALID_BIN",
                        messageType: "Error",
                        message: "Please enter or scan valid bin.",
                        category: "RECEIVING",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 420:
            msgobj = {
                messageBuildNumber: 421,
                developer: "Shweta",
                message: [
                    {
                        messageCode: "GLB10010",
                        messageKey: "DOCUMENT_UPDATED",
                        messageType: "Success",
                        message: "Document is updated successfully.",
                        category: "GLOBAL",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 421:
            msgobj = {
                messageBuildNumber: 422,
                developer: "Shweta",
                message: [
                    {
                        messageCode: "GLB10011",
                        messageKey: "DOCUMENT_COMMON_ACTION",
                        messageType: "Success",
                        message: "Document is {0} successfully.",
                        category: "GLOBAL",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 422:
            msgobj = {
                messageBuildNumber: 423,
                developer: "Shweta",
                message: [
                    {
                        messageCode: "GLB10012",
                        messageKey: "FILE_FOLDER_REMOVE",
                        messageType: "Success",
                        message: "{0} removed successfully!",
                        category: "GLOBAL",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 423:
            msgobj = {
                messageBuildNumber: 424,
                developer: "Shweta",
                message: [
                    {
                        messageCode: "GLB20024",
                        messageKey: "GENERIC_FOLDER_DUPLICATE_NAME",
                        messageType: "Error",
                        message: "Folder with same name already exists.",
                        category: "GLOBAL",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 424:
            msgobj = {
                messageBuildNumber: 425,
                developer: "Shweta",
                message: [
                    {
                        messageCode: "GLB50017",
                        messageKey: "IMPORT_FILE_NO_DATA_FOUND",
                        messageType: "Information",
                        message: "Document not contain any data. Please check!S",
                        category: "GLOBAL",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 425:
            msgobj = {
                messageBuildNumber: 426,
                developer: "Ashish",
                message: [
                    {
                        messageCode: "MST30010",
                        messageKey: "LABEL_TEMPLATE_VERIFICATION_MESSAGE",
                        messageType: "Warning",
                        message: "<b>{0}</b> Label Template(s) is invalid, rest of the Label Template(s) verified successfully.",
                        category: "MASTER",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 426:
            msgobj = {
                messageBuildNumber: 427,
                developer: "Ashish",
                message: [
                    {
                        messageCode: "MST10032",
                        messageKey: "LABEL_TEMPLATE_VERIFICATION_SUCCESS_MESSAGE",
                        messageType: "Success",
                        message: "Label template(s) verified successfully.",
                        category: "MASTER",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 427:
            msgobj = {
                messageBuildNumber: 428,
                developer: "Shirish",
                message: [{
                    messageCode: "GLB30011",
                    messageKey: "DOCUMENT_ALREADY_ADDED",
                    messageType: "Warning",
                    message: "Document {0} already added.",
                    category: "GLOBAL",
                    createdDate: new Date(COMMON.getCurrentUTC()),
                    action: "U"
                }]
            };
            break;
        case 428:
            msgobj = {
                messageBuildNumber: 429,
                developer: "Shaktidan",
                message: [
                    {
                        messageCode: "MST40015",
                        messageKey: "ALL_PIVOT_CONFIGURATION_RESET",
                        messageType: "Confirmation",
                        message: "Are you sure? All Pivot configuration will be reset on update.",
                        category: "MASTER",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 429:
            msgobj = {
                messageBuildNumber: 430,
                developer: "Shaktidan",
                message: [
                    {
                        messageCode: "MST20031",
                        messageKey: "SELECT_ATLEAST_ONE_FIELD",
                        messageType: "Error",
                        message: "Please select at least one field",
                        category: "MASTER",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 430:
            msgobj = {
                messageBuildNumber: 431,
                developer: "Shaktidan",
                message: [
                    {
                        messageCode: "MST50023",
                        messageKey: "EMP_DELETE_NOT_ALLOWED_BY_CREATED_EMP",
                        messageType: "Information",
                        message: "Not allowed as selected user has created report",
                        category: "MASTER",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 431:
            msgobj = {
                messageBuildNumber: 432,
                developer: "Shaktidan",
                message: [
                    {
                        messageCode: "MST40017",
                        messageKey: "WITHOUT_APPLING_FILTER_ALERT_BODY_MESSAGE",
                        messageType: "Confirmation",
                        message: "You will lose all filter changes.<br/> Are you sure you want to clear filter changes?",
                        category: "MASTER",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 432:
            msgobj = {
                messageBuildNumber: 433,
                developer: "Shaktidan",
                message: [
                    {
                        messageCode: "MST20032",
                        messageKey: "INVALID_EXPRESSION",
                        messageType: "Error",
                        message: "Expression invalid.",
                        category: "MASTER",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 433:
            msgobj = {
                messageBuildNumber: 434,
                developer: "Shubham",
                message: [
                    {
                        messageCode: "GLB40019",
                        messageKey: "APPLY_DOCUMENT_CHANGES_ALERT_BODY_MESSAGE",
                        messageType: "Confirmation",
                        message: "You have made some changes in document, which are not applied yet.<br />Do you want to apply them and save them? Press Yes to Continue.",
                        category: "GLOBAL",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 434:
            msgobj = {
                messageBuildNumber: 435,
                developer: "Shubham",
                message: [
                    {
                        messageCode: "GLB20025",
                        messageKey: "PREFIX_OR_SUFFIX_REQUIRED_MESSAGE",
                        messageType: "Error",
                        message: "Please enter at least one value either prefix or suffix, or else enter both.",
                        category: "GLOBAL",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 435:
            msgobj = {
                messageBuildNumber: 436,
                developer: "Ashish",
                message: [
                    {
                        messageCode: "MST10014",
                        messageKey: "WEBSERVICE_CHECK_SUCCESS",
                        messageType: "Success",
                        message: "Label template <b>{0}</b> is verified successfully.",
                        category: "MASTER",
                        modifiedDate: new Date(COMMON.getCurrentUTC()),
                        action: "U"
                    }
                ]
            };
            break;
        case 436:
            msgobj = {
                messageBuildNumber: 437,
                developer: "Shweta",
                message: [
                    {
                        messageCode: "GLB50017",
                        messageKey: "IMPORT_FILE_NO_DATA_FOUND",
                        messageType: "Information",
                        message: "Document not contain any data. Please check!",
                        category: "GLOBAL",
                        modifiedDate: new Date(COMMON.getCurrentUTC()),
                        action: "U"
                    }
                ]
            };
            break;
        case 437:
            msgobj = {
                messageBuildNumber: 438,
                developer: "Ashish",
                message: [
                    {
                        messageCode: "PRT20003",
                        messageKey: "COMPONENT_ASSEMBLY_NICKNAME_SHOULD_BE_SAME_MESSAGE",
                        messageType: "Error",
                        message: "<b>{0}</b> Nickname is invalid. Customer <b>{1}</b> Part# <b>{2}</b> all revisions must have same nicknames. Please check and correct.",
                        category: "PARTS",
                        modifiedDate: new Date(COMMON.getCurrentUTC()),
                        action: "U"
                    }
                ]
            };
            break;
        case 438:
            msgobj = {
                messageBuildNumber: 439,
                developer: "Fenil",
                message: [
                    {
                        messageCode: "RCV20060",
                        messageKey: "SPQ_ZERO_NOT_ALLOW_FOR_TR",
                        messageType: "Error",
                        message: "<b>SPQ</b> does not allow <b>0</b> for packaging <b>Tape & Reel</b> so please set SPQ in part master.",
                        category: "RECEIVING",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 439:
            msgobj = {
                messageBuildNumber: 440,
                developer: "Dharmesh",
                message: [
                    {
                        messageCode: "RCV20001",
                        messageKey: "NOT_ALLOW_RETURN_KIT_FOR_ALLOCATED_UMID",
                        messageType: "Error",
                        message: "You cannot return kit as inventory allocated to this kit.",
                        category: "RECEIVING",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "D"
                    }
                ]
            };
            break;
        case 440:
            msgobj = {
                messageBuildNumber: 441,
                developer: "Dharmesh",
                message: [
                    {
                        messageCode: "RCV40013",
                        messageKey: "NOT_ALLOW_RETURN_KIT_FOR_ALLOCATED_UMID",
                        messageType: "Confirmation",
                        message: "You cannot return this kit as inventory is already allocated to this kit.<br />Please deallocate the inventory prior to returning the kit.",
                        category: "RECEIVING",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 441:
            msgobj = {
                messageBuildNumber: 442,
                developer: "Champak",
                message: [
                    {
                        messageCode: "MGF40002",
                        messageKey: "SALESORDER_CANCEL_REASON_CONFIRMATION",
                        messageType: "Confirmation",
                        message: "Are you sure, You want to cancel sales order?",
                        category: "MFG",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 442:
            msgobj = {
                messageBuildNumber: 443,
                developer: "Fenil",
                message: [
                    {
                        messageCode: "RCV20060",
                        messageKey: "SPQ_ZERO_NOT_ALLOW_FOR_TR",
                        messageType: "Error",
                        message: "For packaging <b>Tape and Reel</b>, <b>SPQ</b> must be greater than <b>0</b>. Please set SPQ in part master.",
                        category: "RECEIVING",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "U"
                    }
                ]
            };
            break;
        case 443:
            msgobj = {
                messageBuildNumber: 444,
                developer: "Shirish",
                message: [
                    {
                        messageCode: "MST40016",
                        messageKey: "WORKSTATION_DELETED_FROM_EMPLOYEE_CONFIRMATION",
                        messageType: "Confirmation",
                        message: "Workstation will be remove from personnel. Press yes to continue.",
                        category: "MASTER",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 444:
            msgobj = {
                messageBuildNumber: 445,
                developer: "Fenil",
                message: [
                    {
                        messageCode: "RCV50016",
                        messageKey: "SHELF_LIFE_UPON_PART_MASTER",
                        messageType: "Information",
                        message: "Hint: In part master set shelf life days so require to insert Date of Manufacture or Date of Expiration.",
                        category: "RECEIVING",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "U"
                    }
                ]
            };
            break;
        case 445:
            msgobj = {
                messageBuildNumber: 446,
                developer: "Fenil",
                message: [
                    {
                        messageCode: "RCV50017",
                        messageKey: "SHELF_LIFE_UPON_MOUNTING_GROUP",
                        messageType: "Information",
                        message: "Hint: This part is belong in Chemical Group so require to insert Date of Manufacture or Date of Expiration.",
                        category: "RECEIVING",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "U"
                    }
                ]
            };
            break;
        case 446:
            msgobj = {
                messageBuildNumber: 447,
                developer: "Fenil",
                message: [
                    {
                        messageCode: "RCV50001",
                        messageKey: "RE_CALCULATE_INTERNALVERSIO",
                        messageType: "Information",
                        message: "Internal Version is mismatched due to changes in BOM. Current version of BOM is <b>{0}</b> and Kit Allocation version is <b>{1}</b>. Please click on Recalculate button to apply changes in Kit Allocation.",
                        category: "RECEIVING",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "U"
                    }
                ]
            };
            break;
        case 447:
            msgobj = {
                messageBuildNumber: 448,
                developer: "Fenil",
                message: [
                    {
                        messageCode: "RCV20061",
                        messageKey: "MISMATCH_UOM_FOR_KIT_ALLOCATION",
                        messageType: "Error",
                        message: "There is an inappropriate available stock detail due to the mismatched UOM on line item <b>{0}</b> of the BOM. Please resolve the error to get proper stock detail.",
                        category: "RECEIVING",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 448:
            msgobj = {
                messageBuildNumber: 449,
                developer: "Fenil",
                message: [
                    {
                        messageCode: "RCV20062",
                        messageKey: "MISMATCH_DATA_KITALLOCATION",
                        messageType: "Error",
                        message: "You cannot allocate to kit because either of mismatched <b>{0}</b> on line item <b>{1}</b> of the BOM or <b>{0}</b> is TBD in part master. Please resolve the mismatched <b>{0}</b> error for allocate to kit.",
                        category: "RECEIVING",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 449:
            msgobj = {
                messageBuildNumber: 450,
                developer: "Fenil",
                message: [
                    {
                        messageCode: "RCV40014",
                        messageKey: "UOM_MISMATCH",
                        messageType: "Confirmation",
                        message: "Line number(s) {0} have mismatched UOM. Please resolve in BOM to continue in kit allocation.",
                        category: "RECEIVING",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 450:
            msgobj = {
                messageBuildNumber: 451,
                developer: "Dharmishtha",
                message: [
                    {
                        messageCode: "RCV20017",
                        messageKey: "MISMATCH_KIT_ALLOCATION_QTY_PLAN_KIT_QTY",
                        messageType: "Error",
                        message: "Plan kit release quantity and kit allocation quantity is mismatched. Please correct it.",
                        category: "RECEIVING",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "U"
                    }
                ]
            };
            break;
        case 451:
            msgobj = {
                messageBuildNumber: 452,
                developer: "Ashish",
                message: [
                    {
                        messageCode: "PRT20028",
                        messageKey: "COMPONENT_REVEISION_DUPLICATE",
                        messageType: "Error",
                        message: "Rev Should not be duplicate.",
                        category: "PARTS",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 452:
            msgobj = {
                messageBuildNumber: 453,
                developer: "Shweta",
                message: [
                    {
                        messageCode: "GLB20026",
                        messageKey: "WEBCAM_ERROR",
                        messageType: "Error",
                        message: "<b>{0}</b>: {1}",
                        category: "GLOBAL",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 453:
            msgobj = {
                messageBuildNumber: 454,
                developer: "Shweta",
                message: [
                    {
                        messageCode: "MST10027",
                        messageKey: "OPERATION_UPDATED",
                        messageType: "Success",
                        message: "Operation updated successfully.",
                        category: "MASTER",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "U"
                    }
                ]
            };
            break;
        case 454:
            msgobj = {
                messageBuildNumber: 455,
                developer: "Fenil",
                message: [
                    {
                        messageCode: "RCV20063",
                        messageKey: "BIN_NOT_HAVE_PART",
                        messageType: "Error",
                        message: "Bin <b>{0}</b> does not contain part <b>{1}({2})</b>.",
                        category: "RECEIVING",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 455:
            msgobj = {
                messageBuildNumber: 456,
                developer: "Fenil",
                message: [
                    {
                        messageCode: "RCV20064",
                        messageKey: "BOM_NOT_FOUND",
                        messageType: "Error",
                        message: "BOM is not created for this assembly.",
                        category: "RECEIVING",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 456:
            msgobj = {
                messageBuildNumber: 457,
                developer: "Fenil",
                message: [
                    {
                        messageCode: "RCV20065",
                        messageKey: "RFQ_NOT_FOUND",
                        messageType: "Error",
                        message: "RFQ is not created for this assembly.",
                        category: "RECEIVING",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 457:
            msgobj = {
                messageBuildNumber: 458,
                developer: "Fenil",
                message: [
                    {
                        messageCode: "RCV20066",
                        messageKey: "CPN_RESTRICTED_PACKAGING_PART",
                        messageType: "Error",
                        message: "CPN <b>{0}</b> was <b>{1}</b> at the part master level.",
                        category: "RECEIVING",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 458:
            msgobj = {
                messageBuildNumber: 459,
                developer: "Fenil",
                message: [
                    {
                        messageCode: "RCV50018",
                        messageKey: "CPN_RECTRICTED_PACKAGING_WITH_PERMISION",
                        messageType: "Information",
                        message: "CPN <b>{0}</b> has been <b>{1}</b> at the part master level.",
                        category: "RECEIVING",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 459:
            msgobj = {
                messageBuildNumber: 460,
                developer: "Fenil",
                message: [
                    {
                        messageCode: "RCV50019",
                        messageKey: "FILL_DETAIL_FOR_UMID",
                        messageType: "Information",
                        message: "<br/> Please fill the User ID, Password and Reason to give permission to generate UMID.",
                        category: "RECEIVING",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 460:
            msgobj = {
                messageBuildNumber: 461,
                developer: "Fenil",
                message: [
                    {
                        messageCode: "RCV20067",
                        messageKey: "SCAN_NOT_CPN",
                        messageType: "Error",
                        message: "Scanned MFR Part is not CPN, Please check.",
                        category: "RECEIVING",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 461:
            msgobj = {
                messageBuildNumber: 462,
                developer: "Fenil",
                message: [
                    {
                        messageCode: "RCV20068",
                        messageKey: "NOT_IN_CPN",
                        messageType: "Error",
                        message: "MFR PN is not contain in CPN.",
                        category: "RECEIVING",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 462:
            msgobj = {
                messageBuildNumber: 463,
                developer: "Fenil",
                message: [
                    {
                        messageCode: "RCV20069",
                        messageKey: "FROM_TO_DEPT_SAME",
                        messageType: "Error",
                        message: "<b>From Bin</b> and <b>To Bin</b> department must be same.",
                        category: "RECEIVING",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 463:
            msgobj = {
                messageBuildNumber: 464,
                developer: "Fenil",
                message: [
                    {
                        messageCode: "RCV20070",
                        messageKey: "COMPONENT_EXPIRE",
                        messageType: "Error",
                        message: "Material is expired. Please contact to superior.",
                        category: "RECEIVING",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 464:
            msgobj = {
                messageBuildNumber: 465,
                developer: "Fenil",
                message: [
                    {
                        messageCode: "RCV20071",
                        messageKey: "PART_EXPIRE",
                        messageType: "Error",
                        message: "Material expiration date crossed shelf life date limit. System will not accept this material. Please contact to superior.",
                        category: "RECEIVING",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 465:
            msgobj = {
                messageBuildNumber: 466,
                developer: "Fenil",
                message: [
                    {
                        messageCode: "RCV20072",
                        messageKey: "COUNT_GREATER",
                        messageType: "Error",
                        message: "Count could not be greater than SPQ.",
                        category: "RECEIVING",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 466:
            msgobj = {
                messageBuildNumber: 467,
                developer: "Fenil",
                message: [
                    {
                        messageCode: "RCV20073",
                        messageKey: "MISMATCH_WITH_KIT",
                        messageType: "Error",
                        message: "{0} is mismatch with allocate to kit.",
                        category: "RECEIVING",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 467:
            msgobj = {
                messageBuildNumber: 468,
                developer: "Fenil",
                message: [
                    {
                        messageCode: "RCV20012",
                        messageKey: "PART_RESTRICT_IN_BOM",
                        messageType: "Error",
                        message: "PID <b>{0}</b> has been <b>Restrict use in BOM</b>.<br/>Thus, you cannot allocate to this assembly.",
                        category: "RECEIVING",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "U"
                    }
                ]
            };
            break;
        case 468:
            msgobj = {
                messageBuildNumber: 469,
                developer: "Fenil",
                message: [
                    {
                        messageCode: "RCV20074",
                        messageKey: "MISMATCH_UOM_DATA_KITALLOCATION",
                        messageType: "Error",
                        message: "You cannot allocate to kit because of mismatch of <b>{0}</b> on line item <b>{1}</b> of the BOM. Please resolve the mismatch <b>{0}</b> error for allocate to kit.",
                        category: "RECEIVING",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 469:
            msgobj = {
                messageBuildNumber: 470,
                developer: "Fenil",
                message: [
                    {
                        messageCode: "RCV20075",
                        messageKey: "NOT_IN_BOM",
                        messageType: "Error",
                        message: "MFR PN/Supplier PN/CPN does not contain in this assembly ID. Please select right MFR/Part Number.",
                        category: "RECEIVING",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 470:
            msgobj = {
                messageBuildNumber: 471,
                developer: "Fenil",
                message: [
                    {
                        messageCode: "RCV20076",
                        messageKey: "REQUIRE_PREFIX",
                        messageType: "Error",
                        message: "UMID Prefix is required for scan label.",
                        category: "RECEIVING",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 471:
            msgobj = {
                messageBuildNumber: 472,
                developer: "Fenil",
                message: [
                    {
                        messageCode: "RCV20077",
                        messageKey: "REQUIRE_CUSTOMER",
                        messageType: "Error",
                        message: "Customer is required for scan label.",
                        category: "RECEIVING",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 472:
            msgobj = {
                messageBuildNumber: 473,
                developer: "Fenil",
                message: [
                    {
                        messageCode: "RCV20078",
                        messageKey: "REQUIRE_SUB_Assembly",
                        messageType: "Error",
                        message: "Assy ID is required for scan label.",
                        category: "RECEIVING",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 473:
            msgobj = {
                messageBuildNumber: 474,
                developer: "Fenil",
                message: [
                    {
                        messageCode: "RCV20079",
                        messageKey: "CPN_NOT_ALLOW",
                        messageType: "Error",
                        message: "Scanned <b>{0}</b> Part# is CPN. So, it is not allow to scan in <b>Purchased Part</b> category. <br/>Please select the <b>Customer Consigned (with CPN) Part</b> category to scan CPN part#.",
                        category: "RECEIVING",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 474:
            msgobj = {
                messageBuildNumber: 475,
                developer: "Fenil",
                message: [
                    {
                        messageCode: "RCV20080",
                        messageKey: "LESS_QTY_OF_PART_MFR",
                        messageType: "Error",
                        message: "If you want to enter quantity less than the minimum quantity of part <b>{0}({1})</b> configured in Part Master then please select other packing except Tape & Reel.",
                        category: "RECEIVING",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 475:
            msgobj = {
                messageBuildNumber: 476,
                developer: "Fenil",
                message: [
                    {
                        messageCode: "RCV40015",
                        messageKey: "UMID_STOCK_NOT_ALLOCATED",
                        messageType: "Confirmation",
                        message: "This UMID could not be allocated, because other UMID(s) is already allocated in this kit and shared with other kit(s).<br/> To allocate this UMID into this kit, please do deallocate UMID(s) from existing kit <b>{0}</b>.",
                        category: "RECEIVING",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 476:
            msgobj = {
                messageBuildNumber: 477,
                developer: "Fenil",
                message: [
                    {
                        messageCode: "RCV40016",
                        messageKey: "UNRESERVE_CONFIMATION",
                        messageType: "Confirmation",
                        message: "Are you sure you want to unreserve stock?",
                        category: "RECEIVING",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 477:
            msgobj = {
                messageBuildNumber: 478,
                developer: "Fenil",
                message: [
                    {
                        messageCode: "RCV20081",
                        messageKey: "WITH_RESERVE",
                        messageType: "Error",
                        message: "In selected record some record is reserve, Please check the selected record.",
                        category: "RECEIVING",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
        case 478:
            msgobj = {
                messageBuildNumber: 479,
                developer: "Fenil",
                message: [
                    {
                        messageCode: "RCV20082",
                        messageKey: "INVAID_CATEGORY",
                        messageType: "Error",
                        message: "Cost category not found for quantity.",
                        category: "RECEIVING",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
        case 479:
            msgobj = {
                messageBuildNumber: 480,
                developer: "Fenil",
                message: [
                    {
                        messageCode: "RCV20083",
                        messageKey: "WITHOUT_RESERVE",
                        messageType: "Error",
                        message: "In selected record some record is without reserve, Please check the selected record.",
                        category: "RECEIVING",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
        case 480:
            msgobj = {
                messageBuildNumber: 481,
                developer: "Fenil",
                message: [
                    {
                        messageCode: "GLB20027",
                        messageKey: "INVALID_DOC_FILE",
                        messageType: "Error",
                        message: "Only csv,xls document type allowed.",
                        category: "GLOBAL",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
        case 481:
            msgobj = {
                messageBuildNumber: 482,
                developer: "Fenil",
                message: [
                    {
                        messageCode: "RCV20084",
                        messageKey: "UMID_IMPORT_COLUMN_NOT_MAPPED",
                        messageType: "Error",
                        message: "Column(s) <b>{0}</b> is not mapped with excel column(s). Please map all column(s) and try again.",
                        category: "RECEIVING",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
        case 482:
            msgobj = {
                messageBuildNumber: 483,
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
        case 483:
            msgobj = {
                messageBuildNumber: 484,
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
        case 484:
            msgobj = {
                messageBuildNumber: 485,
                developer: "Shweta",
                message: [
                    {
                        messageCode: "MST20033",
                        messageKey: "MASTER_TEMPLATE_UNIQUE",
                        messageType: "Error",
                        message: "Operation management name must be unique.",
                        category: "MASTER",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 485:
            msgobj = {
                messageBuildNumber: 486,
                developer: "Shweta",
                message: [
                    {
                        messageCode: "MST10033",
                        messageKey: "MASTERTEMPLATE_CREATED",
                        messageType: "Success",
                        message: "Template created successfully.",
                        category: "MASTER",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 486:
            msgobj = {
                messageBuildNumber: 487,
                developer: "Shweta",
                message: [
                    {
                        messageCode: "MST10034",
                        messageKey: "MASTERTEMPLATE_UPDATED",
                        messageType: "Success",
                        message: "Template updated successfully.",
                        category: "MASTER",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 487:
            msgobj = {
                messageBuildNumber: 488,
                developer: "Shweta",
                message: [
                    {
                        messageCode: "MST10035",
                        messageKey: "MASTERTEMPLATE_DELETED",
                        messageType: "Success",
                        message: "Template deleted successfully.",
                        category: "MASTER",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 488:
            msgobj = {
                messageBuildNumber: 489,
                developer: "Shweta",
                message: [
                    {
                        messageCode: "MST20034",
                        messageKey: "MASTERTEMPLATE_NOT_UPDATED",
                        messageType: "Error",
                        message: "Template could not be updated.",
                        category: "MASTER",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 489:
            msgobj = {
                messageBuildNumber: 490,
                developer: "Shweta",
                message: [
                    {
                        messageCode: "MST10036",
                        messageKey: "OPERATION_SAVED_FOR_MASTERTEMPLATE",
                        messageType: "Success",
                        message: "Operation added to template.",
                        category: "MASTER",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 490:
            msgobj = {
                messageBuildNumber: 491,
                developer: "Shweta",
                message: [
                    {
                        messageCode: "MST10037",
                        messageKey: "SAVED_FOR_MASTERTEMPLATE",
                        messageType: "Success",
                        message: "Template added to operation.",
                        category: "MASTER",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 491:
            msgobj = {
                messageBuildNumber: 492,
                developer: "Shweta",
                message: [
                    {
                        messageCode: "MST10038",
                        messageKey: "COPY_TEMPLATE",
                        messageType: "Success",
                        message: "Template copied successfully.",
                        category: "MASTER",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 492:
            msgobj = {
                messageBuildNumber: 493,
                developer: "Shweta",
                message: [
                    {
                        messageCode: "MST10039",
                        messageKey: "REMOVED_FROM_MASTERTEMPLATE",
                        messageType: "Success",
                        message: "Template removed from operation.",
                        category: "MASTER",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 493:
            msgobj = {
                messageBuildNumber: 494,
                developer: "Shweta",
                message: [
                    {
                        messageCode: "MST10040",
                        messageKey: "OPERATION_REMOVED_FROM_MASTERTEMPLATE",
                        messageType: "Success",
                        message: "Operation removed from  template.",
                        category: "MASTER",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 494:
            msgobj = {
                messageBuildNumber: 495,
                developer: "Shweta",
                message: [
                    {
                        messageCode: "MST40018",
                        messageKey: "OPERATION_TEMPLATE_DELETE_MAPPING",
                        messageType: "Confirmation",
                        message: "Operation will be remove from Operation Template. Press yes to continue.",
                        category: "MASTER",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 495:
            msgobj = {
                messageBuildNumber: 496,
                developer: "Shweta",
                message: [
                    {
                        messageCode: "MST20035",
                        messageKey: "FILL_DET_BEFORE_STATUS_CHANGE",
                        messageType: "Error",
                        message: "In prior to publish {0}, you must have to fill up all required details.",
                        category: "MASTER",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 496:
            msgobj = {
                messageBuildNumber: 497,
                developer: "Shweta",
                message: [
                    {
                        messageCode: "MST20036",
                        messageKey: "ADD_OP_TO_CHANGE_TEMPLATE_STATUS",
                        messageType: "Error",
                        message: "No operation(s) are assigned to selected operation management. Please add operation first.",
                        category: "MASTER",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;
        case 497:
            msgobj = {
                messageBuildNumber: 498,
                developer: "Shweta",
                message: [
                    {
                        messageCode: "MST50024",
                        messageKey: "WORKORDER_OPERATION_NOTALLOW",
                        messageType: "Information",
                        message: "Selected operation is not allowed current process. Please select other operation.",
                        category: "MASTER",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break; 
        case 498:
            msgobj = {
                messageBuildNumber: 499,
                developer: "Shweta",
                message: [
                    {
                        messageCode: "MST10041",
                        messageKey: "OPERATION_DATAELEMENT_CREATED",
                        messageType: "Success",
                        message: "Operation data field created successfully.",
                        category: "MASTER",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;       
        case 499:
            msgobj = {
                messageBuildNumber: 500,
                developer: "Shweta",
                message: [
                    {
                        messageCode: "MST10042",
                        messageKey: "OPERATION_DATAELEMENT_UPDATED",
                        messageType: "Success",
                        message: "Operation data field updated successfully.",
                        category: "MASTER",
                        createdDate: new Date(COMMON.getCurrentUTC()),
                        action: "I"
                    }
                ]
            };
            break;             
        
       default: break;
    };

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
var Sequelize = require('sequelize');

module.exports = (sequelize) => {
    const Employee = sequelize.define('Employee', {
        firstName: {
            type: Sequelize.STRING,
            allowNull: false,
            validate: {
                notEmpty: true,
                len: [1, 50]
            }
        },
        lastName: {
            type: Sequelize.STRING,
            allowNull: false,
            validate: {
                notEmpty: true,
                len: [1, 50]
            }
        },
        email: {
            type: Sequelize.STRING,
            allowNull: true,
            validate: {
                len: [0, 50]
            }
        },
        contact: {
            type: Sequelize.STRING,
            allowNull: true,
            validate: {
                len: [0, 50]
            }
        },
        managerID: {
            allowNull: true,
            type: Sequelize.INTEGER
        },
        burdenRate: {
            type: Sequelize.DECIMAL,
            allowNull: true
        },
        street1: {
            type: Sequelize.STRING,
            allowNull: true,
            validate: {
                len: [0, 255]
            }
        },
        street2: {
            type: Sequelize.STRING,
            allowNull: true,
            validate: {
                len: [0, 255]
            }
        },
        postcode: {
            type: Sequelize.STRING,
            allowNull: true,
            validate: {
                len: [0, 10]
            }
        },
        city: {
            type: Sequelize.STRING,
            allowNull: true,
            validate: {
                len: [0, 50]
            }
        },
        state: {
            type: Sequelize.STRING,
            allowNull: true,
            validate: {
                len: [0, 50]
            }
        },
        countryID: {
            type: Sequelize.STRING,
            allowNull: true,
            validate: {
                len: [0, 50]
            }
        },
        paymentMode: {
            type: Sequelize.STRING,
            allowNull: true,
            validate: {
                notEmpty: true,
                len: [1, 10]
            }
        },
        code: {
            type: Sequelize.VIRTUAL,
            validate: {
                notEmpty: true
            }
        },
        codeDigest: {
            type: Sequelize.STRING,
            validate: {
                notEmpty: true
            }
        },
        visibleCode: {
            type: Sequelize.STRING,
            allowNull: false,
            validate: {
                notEmpty: true,
                len: [1, 4]
            }
        },
        faxNumber: {
            type: Sequelize.STRING,
            allowNull: true
        },
        createdBy: {
            type: Sequelize.STRING,
            allowNull: true
        },
        updatedBy: {
            type: Sequelize.STRING,
            allowNull: true
        },
        deletedBy: {
            type: Sequelize.STRING,
            allowNull: true
        },
        isDeleted: {
            type: Sequelize.BOOLEAN,
            allowNull: true
        },
        workAreaID: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        profileImg: {
            type: Sequelize.STRING,
            allowNull: true
        },
        middleName: {
            type: Sequelize.STRING,
            allowNull: true,
            validate: {
                notEmpty: false,
                len: [0, 50]
            }
        },
        initialName: {
            type: Sequelize.STRING,
            allowNull: false,
            validate: {
                notEmpty: true,
                len: [1, 50]
            }
        },
        isExternalEmployee: {
            type: Sequelize.BOOLEAN,
            allowNull: true
        },
        isActive: {
            type: Sequelize.BOOLEAN,
            allowNull: false
        },
        defaultChartCategoryID: {
            allowNull: true,
            type: Sequelize.INTEGER
        },
        phExtension: {
            type: Sequelize.STRING,
            allowNull: true
        },
        supplierID: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        contactCountryCode: {
            type: Sequelize.STRING,
            allowNull: true
        },
        faxCountryCode: {
            type: Sequelize.STRING,
            allowNull: true
        },
        street3: {
            type: Sequelize.STRING,
            allowNull: true,
            validate: {
                len: [0, 255]
            }
        },
        logoutIdleTime: {
            allowNull: true,
            type: Sequelize.INTEGER
        },
        documentPath: {
            type: Sequelize.STRING,
            allowNull: true
        },
        createByRoleId: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        updateByRoleId: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        deleteByRoleId: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        personnelType: {
            type: Sequelize.STRING,
            allowNull: false,
            defaultValue: 'P'
        }
    },
        {
            tableName: 'employees',
            paranoid: true
        });

    Employee.associate = (models) => {
        Employee.hasMany(models.OperationEmployee, {
            foreignKey: 'employeeID',
            as: 'operationEmployee'
        });
        Employee.hasMany(models.EmployeeDepartment, {
            foreignKey: 'employeeID',
            as: 'employeeDepartment'
        });
        Employee.hasMany(models.WorkorderOperationEmployee, {
            foreignKey: 'employeeID',
            as: 'workorderOperationEmployee'
        });
        Employee.belongsTo(models.Employee, {
            foreignKey: 'managerID',
            as: 'managerEmployee'
        });
        Employee.hasMany(models.EmployeeEquipment, {
            foreignKey: 'employeeID',
            as: 'employeeEquipment'
        });
        Employee.hasMany(models.ECORequest, {
            foreignKey: 'initiateBy',
            as: 'ecoRequest'
        });
        Employee.hasMany(models.ECORequest, {
            foreignKey: 'finalStatusInit',
            as: 'ecoRequest_finalStatusInit'
        });
        Employee.hasMany(models.ECORequestDepartmentApproval, {
            foreignKey: 'employeeID',
            as: 'eco_request_department_approval'
        });
        Employee.hasMany(models.ECORequestDepartmentEmployee, {
            foreignKey: 'employeeID',
            as: 'eco_request_department_employee'
        });
        Employee.hasMany(models.WorkorderReqForReview, {
            as: 'reqGenWOReqForReview',
            foreignKey: 'reqGenEmployeeID'
        });
        Employee.hasMany(models.WorkorderReqForReview, {
            as: 'woAutherWOReqForReview',
            foreignKey: 'woAuthorID'
        });
        Employee.hasMany(models.WorkorderReqForReview, {
            as: 'accRejWOReqForReview',
            foreignKey: 'accRejBy'
        });

        Employee.hasMany(models.WorkorderReqRevInvitedEmp, {
            as: 'requstedWOReqRevInvitedEmp',
            foreignKey: 'requstedEmployeeID'
        });
        Employee.hasMany(models.WorkorderReqRevInvitedEmp, {
            as: 'employeeWOReqRevInvitedEmp',
            foreignKey: 'employeeID'
        });

        Employee.hasMany(models.WorkorderReqRevComments, {
            as: 'accRejWOReqRevComments',
            foreignKey: 'accRejBy'
        });
        Employee.hasMany(models.WorkorderReqRevComments, {
            as: 'commentWOReqRevComments',
            foreignKey: 'commentemployeeID'
        });
        Employee.hasMany(models.NotificationMst, {
            as: 'notificationMst',
            foreignKey: 'senderID'
        });
        Employee.hasMany(models.NotificationDet, {
            as: 'notificationDet',
            foreignKey: 'receiverID'
        });

        Employee.hasMany(models.WorkorderTransEmpinout, {
            foreignKey: 'employeeID',
            as: 'workorderTransEmpinout'
        });
        Employee.hasMany(models.WorkorderTrans, {
            foreignKey: 'checkinEmployeeID',
            as: 'workorderTransCheckIn'
        });
        Employee.hasMany(models.User, {
            foreignKey: 'employeeID',
            as: 'user'
        });
        Employee.hasMany(models.WorkorderTransAssyDefectdet, {
            foreignKey: 'employeeID',
            as: 'workorder_trans_assy_defectdet'
        });
        Employee.hasMany(models.WorkorderTransOperationHoldUnhold, {
            foreignKey: 'holdEmployeeId',
            as: 'holdEmployees'
        });
        Employee.hasMany(models.WorkorderTransOperationHoldUnhold, {
            foreignKey: 'unHoldEmployeeId',
            as: 'unHoldEmployees'
        });
        Employee.hasMany(models.WorkorderTransPreprogramComp, {
            as: 'workorder_trans_preprogramcomp',
            foreignKey: 'employeeID'
        });

        Employee.hasMany(models.RFQForms, {
            as: 'rfqForms',
            foreignKey: 'employeeID'
        });

        Employee.hasMany(models.ShippingRequest, {
            foreignKey: 'requestedBy',
            as: 'shippingRequest'
        });

        Employee.hasMany(models.ShippingRequestEmpDet, {
            foreignKey: 'employeeID',
            as: 'shippingRequestEmpDet'
        });
        Employee.hasMany(models.ChartTemplateAccess, {
            foreignKey: 'employeeID',
            as: 'chartTemplateAccess'
        });
        Employee.hasMany(models.RFQLineitemsApprovalComment, {
            as: 'rfqLineitemsApprovalComment',
            foreignKey: 'approvalBy'
        });
        Employee.belongsTo(models.CountryMst, {
            as: 'countryMst',
            foreignKey: 'countryID'
        });
        Employee.hasMany(models.DynamicReportAccess, {
            as: 'dynamicReportAccess',
            foreignKey: 'EmployeeID'
        });
        Employee.hasMany(models.WorkorderTransRack, {
            as: 'workorderTransRack',
            foreignKey: 'employeeID'
        });
        Employee.hasMany(models.RackMstHistory, {
            as: 'rackMstHistory',
            foreignKey: 'employeeID'
        });

        Employee.hasMany(models.EmployeeResponsibility, {
            as: 'employeeResponsibility',
            foreignKey: 'employeeID'
        });
        Employee.hasMany(models.MfgCodeMst, {
            as: 'customer',
            foreignKey: 'salesCommissionTo'
        });
        Employee.hasMany(models.RFQForms, {
            as: 'salesCommisionRfqForms',
            foreignKey: 'salesCommissionTo'
        });
        Employee.hasMany(models.SalesOrderDet, {
            as: 'salesorderDet',
            foreignKey: 'salesCommissionTo'
        });
        Employee.hasMany(models.SalesOrderMst, {
            as: 'salesorderMst',
            foreignKey: 'salesCommissionTo'
        });
        Employee.hasMany(models.CustomerPackingSlip, {
            as: 'customerPackingSlip',
            foreignKey: 'salesCommissionTo'
        });
        Employee.hasMany(models.PurchaseOrderDet, {
            as: 'commissionPurchaseOrderDet',
            foreignKey: 'salesCommissionTo'
        });
        Employee.hasMany(models.PurchaseOrderMst, {
            as: 'empPurchaseOrderMst',
            foreignKey: 'contactPersonEmpID'
        });
        Employee.hasMany(models.EmployeeContactPerson, {
            foreignKey: 'employeeId',
            as: 'employeeContactPerson'
        });
    };
    return Employee;
};
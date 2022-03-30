const Sequelize = require('sequelize');

module.exports = (sequelize) => {
    const RFQForms = sequelize.define('RFQForms', {
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER
        },
        customerId: {
            allowNull: false,
            type: Sequelize.INTEGER
        },
        custBillingAddID: {
            allowNull: true,
            type: Sequelize.INTEGER
        },
        custShippingAddID: {
            allowNull: true,
            type: Sequelize.INTEGER
        },
        customercontactpersonID: {
            allowNull: true,
            type: Sequelize.INTEGER
        },
        jobtypeID: {
            allowNull: false,
            type: Sequelize.INTEGER
        },
        rfqtypeID: {
            allowNull: false,
            type: Sequelize.INTEGER
        },
        employeeID: {
            allowNull: false,
            type: Sequelize.INTEGER
        },
        isActive: {
            allowNull: false,
            type: Sequelize.BOOLEAN
        },
        quoteindate: {
            allowNull: false,
            type: Sequelize.DATEONLY
        },
        quoteduedate: {
            allowNull: false,
            type: Sequelize.DATEONLY
        },
        quoteNote: {
            allowNull: true,
            type: Sequelize.TEXT
        },
        DisplayRfqId: {
            allowNull: true,
            type: Sequelize.INTEGER
        },
        isDeleted: {
            type: Sequelize.BOOLEAN,
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
        createdAt: {
            type: Sequelize.DATE,
            allowNull: true
        },
        updatedAt: {
            type: Sequelize.DATE,
            allowNull: true
        },
        deletedAt: {
            type: Sequelize.DATE,
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
        consolidateActivityStarted: {
            type: Sequelize.BOOLEAN,
            allowNull: true
        },
        salesCommissionTo: {
            type: Sequelize.INTEGER,
            allowNull: false
        }
    }, {
        paranoid: true,
        tableName: 'rfqforms'
    });

    RFQForms.associate = (models) => {
        RFQForms.hasMany(models.RFQAssemblies, {
            as: 'rfqAssemblies',
            foreignKey: 'rfqrefID'
        });

        RFQForms.belongsTo(models.MfgCodeMst, {
            as: 'customer',
            foreignKey: 'customerId'
        });

        RFQForms.belongsTo(models.CustomerAddresses, {
            as: 'customerBillingAddress',
            foreignKey: 'custBillingAddID'
        });

        RFQForms.belongsTo(models.CustomerAddresses, {
            as: 'customerShippingAddress',
            foreignKey: 'custShippingAddID'
        });

        RFQForms.belongsTo(models.MfgCodeMst, {
            as: 'customerContactPerson',
            foreignKey: 'customercontactpersonID'
        });

        RFQForms.belongsTo(models.Employee, {
            as: 'employee',
            foreignKey: 'employeeID'
        });

        RFQForms.hasMany(models.RFQPriceGroup, {
            as: 'rfqPriceGroup',
            foreignKey: 'refRFQID'
        });

        RFQForms.hasMany(models.RFQPriceGroupDetail, {
            as: 'rfqPriceGroupDetail',
            foreignKey: 'refRFQID'
        });
        RFQForms.belongsTo(models.Employee, {
            as: 'salesCommissionEmployee',
            foreignKey: 'salesCommissionTo'
        });
        RFQForms.hasMany(models.SalesOrderDet, {
            as: 'salesorderDet',
            foreignKey: 'refRFQGroupID'
        });
    };

    return RFQForms;
};

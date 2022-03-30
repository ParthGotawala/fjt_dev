const Sequelize = require('sequelize');

module.exports = (sequelize) => {
    const CustomerPackingSlipOtherExpenseDetails = sequelize.define('CustomerPackingSlipOtherExpenseDetails', {
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER
        },
        refCustomerPackingSlipDetID: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        partID: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        qty: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        price: {
            type: Sequelize.DECIMAL(18, 6),
            allowNull: true
        },
        frequency: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        remark: {
            type: Sequelize.STRING,
            allowNull: true
        },
        lineComment: {
            type: Sequelize.STRING,
            allowNull: true
        },
        lineInternalComment: {
            type: Sequelize.STRING,
            allowNull: true
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
        createByRoleId: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        updateByRoleId: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        frequencyType: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        deleteByRoleId: {
            type: Sequelize.INTEGER,
            allowNull: true
        }
    },
        {
            tableName: 'customer_packingslip_otherexpense_details',
            paranoid: true
        });

    CustomerPackingSlipOtherExpenseDetails.associate = (models) => {
        CustomerPackingSlipOtherExpenseDetails.belongsTo(models.CustomerPackingSlipDet, {
            foreignKey: 'refCustomerPackingSlipDetID',
            as: 'customerPackingSlipDet'
        });
        CustomerPackingSlipOtherExpenseDetails.belongsTo(models.Component, {
            foreignKey: 'partID',
            as: 'component'
        });
    };
    return CustomerPackingSlipOtherExpenseDetails;
};

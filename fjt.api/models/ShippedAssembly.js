/* eslint-disable global-require */
const Sequelize = require('sequelize');

module.exports = (sequelize) => {
    const ShippedAssembly = sequelize.define('ShippedAssembly', {

        id: {
            type: Sequelize.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true
        },
        partID: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        workorderID: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        shippingId: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        shippedqty: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        // outwinvoiceno: {
        //     type: Sequelize.STRING,
        //     allowNull: true
        // },
        // outwinvoicedate: {
        //     type: Sequelize.DATEONLY,
        //     allowNull: true
        // },
        customerID: {
            type: Sequelize.INTEGER,
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
        deletedAt: {
            type: Sequelize.DATE,
            allowNull: true
        },
        woOPID: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        shippedNotes: {
            type: Sequelize.TEXT,
            allowNull: true
        },
        refCustPackingSlipDetID: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        woNumber: {
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
        stockType: {
            type: Sequelize.STRING,
            allowNull: true
        },
        refsidid: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        refBoxSerialID: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        originalQty: {
            type: Sequelize.INTEGER,
            allowNull: true
        }
    }, {
        paranoid: true,
        tableName: 'shippedassembly'
    });

    ShippedAssembly.associate = (models) => {
        ShippedAssembly.belongsTo(models.Workorder, {
            as: 'workorder',
            foreignKey: 'workorderID'
        });
        ShippedAssembly.belongsTo(models.WorkorderOperation, {
            as: 'workorderoperation',
            foreignKey: 'woOPID'
        });
        ShippedAssembly.belongsTo(models.SalesShippingMst, {
            as: 'salesShippingMst',
            foreignKey: 'shippingId'
        });
        ShippedAssembly.belongsTo(models.MfgCodeMst, {
            as: 'customer',
            foreignKey: 'customerID'
        });
        ShippedAssembly.belongsTo(models.Component, {
            as: 'componentAssembly',
            foreignKey: 'partID'
        });
        ShippedAssembly.belongsTo(models.CustomerPackingSlipDet, {
            as: 'customerPackingSlipDet',
            foreignKey: 'refCustPackingSlipDetID'
        });
    };

    return ShippedAssembly;
};

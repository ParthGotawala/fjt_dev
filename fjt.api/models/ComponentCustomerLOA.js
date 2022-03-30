const Sequelize = require('sequelize');

module.exports = (sequelize) => {
    const ComponentCustomerLOA = sequelize.define('ComponentCustomerLOA', {
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER
        },
        customerID: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        componentID: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        rfqAssyID: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        refLineitemID: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        isDocumentUpload: {
            type: Sequelize.BOOLEAN,
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
        loa_price: {
            type: Sequelize.DECIMAL(16, 6),
            allowNull: true
        },
        documentPath: {
            type: Sequelize.STRING,
            allowNull: true
        }
    },
        {
            tableName: 'component_customer_loa',
            paranoid: true
        });

    ComponentCustomerLOA.associate = (models) => {
        ComponentCustomerLOA.belongsTo(models.Component, {
            as: 'Component',
            foreignKey: 'componentID'
        });
        ComponentCustomerLOA.belongsTo(models.MfgCodeMst, {
            as: 'mfgCodemst',
            foreignKey: 'customerID'
        });

        ComponentCustomerLOA.belongsTo(models.RFQLineItems, {
            as: 'rfqLineItems',
            foreignKey: 'refLineitemID'
        });

        ComponentCustomerLOA.belongsTo(models.RFQAssemblies, {
            as: 'rfqAssembly',
            foreignKey: 'rfqAssyID'
        });
    };

    return ComponentCustomerLOA;
};
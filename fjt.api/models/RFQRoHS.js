/* eslint-disable global-require */
const Sequelize = require('sequelize');

module.exports = (sequelize) => {
    const RFQRoHS = sequelize.define('RFQRoHS', {
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER
        },
        name: {
            type: Sequelize.STRING,
            allowNull: false,
            validate: {
                notEmpty: true,
                len: [1, 50]
            }
        },
        description: {
            type: Sequelize.STRING,
            allowNull: true,
            validate: {
                len: [0, 250]
            }
        },
        isActive: {
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
        systemGenerated: {
            type: Sequelize.BOOLEAN
        },
        rohsIcon: {
            type: Sequelize.STRING,
            allowNull: true
        },
        refMainCategoryID: {
            type: Sequelize.INTEGER,
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
        displayOrder: {
            type: Sequelize.DECIMAL(10, 5),
            allowNull: true
        },
        refParentID: {
            type: Sequelize.INTEGER,
            allowNull: true
        }
    },
        {
            tableName: 'rfq_rohsmst',
            paranoid: true
        }
    );

    RFQRoHS.associate = (models) => {
        RFQRoHS.hasMany(models.Component, {
            foreignKey: 'RoHSStatusID',
            as: 'component'
        });
        RFQRoHS.belongsTo(models.RFQRoHSMainCategory, {
            foreignKey: 'refMainCategoryID',
            as: 'rfq_rohs_main_categorymst'
        });
        RFQRoHS.hasMany(models.ComponentSidStock, {
            foreignKey: 'rohsStatusID',
            as: 'UMIDRohsStatus'
        });
        RFQRoHS.belongsTo(models.RFQRoHS, {
            foreignKey: 'refParentID',
            as: 'parentRoHS'
        });
        RFQRoHS.hasMany(models.RFQRoHSPeer, {
            foreignKey: 'rohsID',
            as: 'referenceRoHS'
        });
        RFQRoHS.hasMany(models.PurchaseOrderDet, {
            foreignKey: 'rohsStatusID',
            as: 'rohspurchaseOrderDet'
        });
    };

    return RFQRoHS;
};

const Sequelize = require('sequelize');

module.exports = (sequelize) => {
    const RFQAssyQuantityTurnTime = sequelize.define('RFQAssyQuantityTurnTime', {
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER
        },
        rfqAssyQtyID: {
            allowNull: false,
            type: Sequelize.INTEGER
        },
        turnTime: {
            allowNull: false,
            type: Sequelize.INTEGER
        },
        unitOfTime: {
            type: Sequelize.STRING,
            allowNull: true,
            validate: {
                notEmpty: false,
                len: [0, 1]
            }
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
        }
    }, {
        paranoid: true,
        tableName: 'rfq_assy_quantity_turn_time'
    });

    RFQAssyQuantityTurnTime.associate = (models) => {
        RFQAssyQuantityTurnTime.belongsTo(models.RFQAssyQuantity, {
            as: 'rfqAssyQuantity',
            foreignKey: 'rfqAssyQtyID'
        });
        RFQAssyQuantityTurnTime.hasMany(models.RFQAssyQuotations, {
            as: 'rfqAssyQuotations',
            foreignKey: 'rfqAssyQtyTurnTimeID'
        });
        RFQAssyQuantityTurnTime.hasMany(models.SalesOrderDet, {
            as: 'salesorderDet',
            foreignKey: 'refRFQQtyTurnTimeID'
        });
    };

    return RFQAssyQuantityTurnTime;
};
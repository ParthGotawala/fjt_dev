const Sequelize = require('sequelize');

module.exports = (sequelize) => {
    const OperationPart = sequelize.define('OperationPart', {
        opPartID: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER
        },
        opID: {
            type: Sequelize.INTEGER,
            allowNull: false,
            validate: {
                notEmpty: true,
                len: [1, 11]
            }
        },
        partID: {
            type: Sequelize.INTEGER,
            allowNull: false,
            validate: {
                notEmpty: true,
                len: [1, 11]
            }
        },
        isDeleted: {
            type: Sequelize.BOOLEAN,
            allowNull: true
        },
        deletedAt: {
            type: Sequelize.DATE,
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
        deleteByRoleId: {
            type: Sequelize.INTEGER,
            allowNull: true
        }
    }, {
        paranoid: true,
        tableName: 'operation_part'
    });

    OperationPart.associate = (models) => {
        OperationPart.belongsTo(models.Operation, {
            as: 'operationsParts',
            foreignKey: 'opID'
        });

        OperationPart.belongsTo(models.Component, {
            as: 'componentSupplyMaterial',
            foreignKey: 'partID'
        });
    };

    return OperationPart;
};

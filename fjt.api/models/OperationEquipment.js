const Sequelize = require('sequelize');

module.exports = (sequelize) => {
    const OperationEquipment = sequelize.define('OperationEquipment', {
        opEqpID: {
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
        eqpID: {
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
        tableName: 'operation_equipment'
    });

    OperationEquipment.associate = (models) => {
        OperationEquipment.belongsTo(models.Operation, {
            as: 'operations',
            foreignKey: 'opID'
        });

        OperationEquipment.belongsTo(models.Equipment, {
            as: 'equipment',
            foreignKey: 'eqpID'
        });
    };

    return OperationEquipment;
};

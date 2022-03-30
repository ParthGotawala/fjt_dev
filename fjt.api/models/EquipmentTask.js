const Sequelize = require('sequelize');

module.exports = (sequelize) => {
    const EquipmentTask = sequelize.define('EquipmentTask', {
        eqpTaskID: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER
        },
        taskDetail: {
            type: Sequelize.STRING,
            allowNull: false,
            validate: {
                notEmpty: true,
                len: [1, 255]
            }
        },
        eqpID: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        isDeleted: {
            type: Sequelize.BOOLEAN,
            allowNull: true
        },
        isActive: {
            type: Sequelize.BOOLEAN,
            allowNull: true
        },
        documentPath: {
            type: Sequelize.STRING,
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
        }
    }, {
        paranoid: true,
        tableName: 'equipment_task'
    });

    EquipmentTask.associate = (models) => {
        EquipmentTask.hasMany(models.EquipmentTaskSchedule, {
            foreignKey: 'eqpTaskID',
            as: 'equipmentTaskSchedule'
        });
    };

    return EquipmentTask;
};
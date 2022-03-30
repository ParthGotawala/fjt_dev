const Sequelize = require('sequelize');

module.exports = (sequelize) => {
    const EquipmentTaskSchedule = sequelize.define('EquipmentTaskSchedule', {
        eqpTaskScheduleID: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER
        },
        eqpTaskID: {
            allowNull: false,
            type: Sequelize.INTEGER
        },
        repeatsType: {
            type: Sequelize.STRING,
            allowNull: true
        },
        dayType: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        monthDate: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        monthType: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        scheduleStartTime: {
            type: Sequelize.DATE,
            allowNull: true
        },
        repeatEnd: {
            type: Sequelize.STRING,
            allowNull: true
        },
        endOnDate: {
            type: Sequelize.DATE,
            allowNull: true
        },
        endAfterOccurrence: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        scheduleRemarks: {
            type: Sequelize.TEXT,
            allowNull: true
        },
        isDeleted: {
            type: Sequelize.BOOLEAN,
            allowNull: true
        },
        isActive: {
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
        }
    }, {
        paranoid: true,
        tableName: 'equipment_task_schedule'
    });
    return EquipmentTaskSchedule;
};
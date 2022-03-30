const Sequelize = require('sequelize');

module.exports = (sequelize) => {
    const CalibrationDetails = sequelize.define('CalibrationDetails', {
        id: {
            type: Sequelize.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true
        },
        refEqpID: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        calibrationType: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        calibrationDate: {
            type: Sequelize.DATEONLY,
            allowNull: false
        },
        calibrationExpirationDate: {
            type: Sequelize.DATEONLY,
            allowNull: false
        },
        calibrationComments: {
            type: Sequelize.STRING,
            allowNull: true
        },
        isDeleted: {
            type: Sequelize.BOOLEAN,
            allowNull: false
        },
        createdBy: {
            type: Sequelize.STRING,
            allowNull: false
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
        createByRoleId: {
            type: Sequelize.INTEGER,
            allowNull: false
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
        tableName: 'calibration_details'
    });

    CalibrationDetails.associate = (models) => {
        CalibrationDetails.belongsTo(models.Equipment, {
            as: 'equipment',
            foreignKey: 'refEqpID'
        });
    };

    return CalibrationDetails;
};
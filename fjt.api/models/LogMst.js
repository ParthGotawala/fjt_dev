const Sequelize = require('sequelize');

module.exports = (sequelize) => {
    const LogMst = sequelize.define('LogMst', {
        logID: {
            type: Sequelize.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        message: {
            type: Sequelize.TEXT,
            allowNull: false
        },
        userID: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        employeeID: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        woID: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        opID: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        woOPID: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        messageType: {
            type: Sequelize.STRING,
            allowNull: true,
            validate: {
                notEmpty: false,
                len: [0, 100]
            }
        },
        createdBy: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        createdAt: {
            type: Sequelize.DATE,
            allowNull: true
        }
    }, {
        paranoid: false,
        tableName: 'logmst'
    });
    return LogMst;
};
/* eslint-disable global-require */

module.exports = (sequelize) => {
    const Sequelize = require('sequelize');

    const TaskConfirmation = sequelize.define('TaskConfirmation', {
        confID: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER
        },
        confirmationType: {
            type: Sequelize.STRING,
            allowNull: false,
            validate: {
                notEmpty: true,
                len: [1, 50]
            }
        },
        signaturevalue: {
            allowNull: true,
            type: Sequelize.STRING

        },
        reason: {
            type: Sequelize.TEXT,
            allowNull: true
        },
        autoRemark: {
            type: Sequelize.STRING,
            allowNull: true,
            validate: {
                len: [1, 500]
            }
        },
        refTablename: {
            type: Sequelize.STRING,
            allowNull: true,
            validate: {
                len: [1, 500]
            }
        },
        refId: {
            allowNull: true,
            type: Sequelize.INTEGER
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
        isDeleted: {
            type: Sequelize.BOOLEAN,
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
    },
        {
            paranoid: true,
            tableName: 'taskconfirmation'
        });
    return TaskConfirmation;
};
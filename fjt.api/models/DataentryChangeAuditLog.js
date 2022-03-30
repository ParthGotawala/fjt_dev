const Sequelize = require('sequelize');

module.exports = (sequelize) => {
    const DataentryChangeAuditLog = sequelize.define('DataentryChangeAuditLog', {
        ID: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER
        },
        Tablename: {
            type: Sequelize.STRING,
            allowNull: true,
            validate: {
                len: [1, 100]
            }
        },
        RefTransID: {
            allowNull: true,
            type: Sequelize.INTEGER
        },
        Colname: {
            type: Sequelize.STRING,
            allowNull: true,
            validate: {
                len: [1, 50]
            }
        },
        Oldval: {
            type: Sequelize.STRING,
            allowNull: true
        },
        Newval: {
            type: Sequelize.STRING,
            allowNull: true
        },
        updatedAt: {
            allowNull: true,
            defaultValue: null,
            type: Sequelize.DATE
        },
        updatedBy: {
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
        },
        woVersion: {
            type: Sequelize.STRING,
            allowNull: true
        },
        opVersion: {
            type: Sequelize.STRING,
            allowNull: true
        },
        valueDataType: {
            type: Sequelize.STRING,
            allowNull: true
        }

    },
        {
            paranoid: true,
            tableName: 'dataentrychange_auditlog'
        });
    return DataentryChangeAuditLog;
};
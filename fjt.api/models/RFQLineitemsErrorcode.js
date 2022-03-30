const Sequelize = require('sequelize');

module.exports = (sequelize) => {
    const RFQLineitemsErrorcode = sequelize.define('RFQLineitemsErrorcode', {
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER
        },
        errorCode: {
            type: Sequelize.STRING,
            allowNull: false,
            validate: {
                notEmpty: false,
                len: [0, 25]
            }
        },
        errorColor: {
            type: Sequelize.STRING,
            allowNull: true
        },
        description: {
            type: Sequelize.STRING,
            allowNull: false,
            validate: {
                notEmpty: false,
                len: [0, 1000]
            }
        },
        systemVariable: {
            type: Sequelize.TEXT
        },
        displayName: {
            type: Sequelize.STRING,
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
        isDeleted: {
            type: Sequelize.BOOLEAN,
            allowNull: true
        },
        logicID: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        narrative: {
            type: Sequelize.STRING,
            allowNull: true
        },
        isExternalIssue: {
            type: Sequelize.BOOLEAN,
            allowNull: false
        },
        isResearchStatus: {
            type: Sequelize.BOOLEAN,
            allowNull: true
        },
        isAllowToEngrApproved: {
            type: Sequelize.BOOLEAN,
            allowNull: true
        },
        isAssemblyLevelError: {
            type: Sequelize.BOOLEAN,
            allowNull: true
        },
        displayOrder: {
            type: Sequelize.DECIMAL,
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
            tableName: 'rfq_lineitems_errorcode',
            paranoid: true
        }
    );
    return RFQLineitemsErrorcode;
};
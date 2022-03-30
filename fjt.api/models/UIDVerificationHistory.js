const Sequelize = require('sequelize');

module.exports = (sequelize) => {
    const UIDVerificationHistory = sequelize.define('UIDVerificationHistory', {
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER
        },
        scanString1: {
            type: Sequelize.STRING(1000),
            allowNull: false,
        },
        scanString2: {
            type: Sequelize.STRING(1000),
            allowNull: false,
        },
        verificationType: {
            type: Sequelize.STRING(100),
            allowNull: false
        },
        string1PartID: {
            allowNull: false,
            type: Sequelize.INTEGER
        },
        scanString1MFG: {
            type: Sequelize.STRING(100),
            allowNull: false
        },
        scanString1MFGPNID: {
            type: Sequelize.STRING(100),
            allowNull: false
        },
        string2PartID: {
            allowNull: false,
            type: Sequelize.INTEGER
        },
        scanString2MFG: {
            type: Sequelize.STRING(100),
            allowNull: false
        },
        scanString2MFGPNID: {
            type: Sequelize.STRING(100),
            allowNull: false
        },
        status: {
            type: Sequelize.STRING(100),
            allowNull: false
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
        unlockUserID: {
            type: Sequelize.STRING(255),
            allowNull: false
        },
        unLockNotes: {
            type: Sequelize.STRING(255),
            allowNull: false
        },
        woTransID: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        woOpEqpID: {
            type: Sequelize.INTEGER,
            allowNull: true
        }
    },
        {
            tableName: 'uid_verification_history',
            paranoid: true
        });

    UIDVerificationHistory.associate = (models) => {
        UIDVerificationHistory.belongsTo(models.Component, {
            foreignKey: 'string1PartID',
            as: 'component'
        });
        UIDVerificationHistory.belongsTo(models.Component, {
            foreignKey: 'string2PartID',
            as: 'otherComponent'
        });
    };

    return UIDVerificationHistory;
};

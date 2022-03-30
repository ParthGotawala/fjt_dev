const Sequelize = require('sequelize');

module.exports = (sequelize) => {
    const MfgCodeStandard = sequelize.define('MfgCodeStandard', {
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER
        },
        standardID: {
            allowNull: false,
            type: Sequelize.INTEGER
        },
        refStandardClassId: {
            allowNull: true,
            type: Sequelize.INTEGER
        },
        refMfgCodeID: {
            allowNull: false,
            type: Sequelize.INTEGER
        },
        standardStatus: {
            allowNull: true,
            type: Sequelize.STRING
        },
        cerificateNumber: {
            allowNull: true,
            type: Sequelize.STRING
        },
        lastApprovalDate: {
            type: Sequelize.DATE,
            allowNull: true
        },
        expDate: {
            type: Sequelize.DATE,
            allowNull: true
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
        createdAt: {
            type: Sequelize.DATE,
            allowNull: true
        },
        updatedAt: {
            type: Sequelize.DATE,
            allowNull: true
        },
        deletedAt: {
            type: Sequelize.DATE,
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
        tableName: 'mfgcode_standard'
    });

    MfgCodeStandard.associate = (models) => {
        MfgCodeStandard.belongsTo(models.MfgCodeMst, {
            as: 'mfgCodemst',
            foreignKey: 'refMfgCodeID'
        });
    };

    return MfgCodeStandard;
};
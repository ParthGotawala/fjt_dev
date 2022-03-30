const Sequelize = require('sequelize');

module.exports = (sequelize) => {
    const InvalidMfgMappingMst = sequelize.define('InvalidMfgMappingMst', {
        id: {
            allowNUll: false,
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER
        },
        refmfgAliasID: {
            type: Sequelize.INTEGER,
            allowNUll: false
        },
        refmfgCodeID: {
            type: Sequelize.INTEGER,
            allowNUll: false
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
    },
        {
            tableName: 'invalid_mfgmappingmst',
            paranoid: true
        });

    InvalidMfgMappingMst.associate = (models) => {
        InvalidMfgMappingMst.belongsTo(models.MfgCodeMst, {
            as: 'mfgCodeMst',
            foreignKey: 'refmfgCodeID'
        });
        InvalidMfgMappingMst.belongsTo(models.MfgCodeAlias, {
            as: 'mfgCodeAlias',
            foreignKey: 'refmfgAliasID'
        });
    };

    return InvalidMfgMappingMst;
};
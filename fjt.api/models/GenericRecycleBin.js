/* eslint-disable global-require */
const Sequelize = require('sequelize');

module.exports = (sequelize) => {
    const GenericRecycleBin = sequelize.define('GenericRecycleBin', {
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER
        },
        name: {
            type: Sequelize.STRING,
            allowNull: false,
            validate: {
                notEmpty: true,
                len: [1, 255]
            }
        },
        refTransID: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        entityID: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        gencFileOwnerType: {
            type: Sequelize.STRING(255),
            allowNull: false
        },
        reftablename: {
            type: Sequelize.STRING(100),
            allowNull: false
        },
        refId: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        parentID: {
            type: Sequelize.INTEGER,
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
        recycledBy: {
            type: Sequelize.STRING,
            allowNull: true
        },
        restoredBy: {
            type: Sequelize.STRING,
            allowNull: true
        },
        deletedBy: {
            type: Sequelize.STRING,
            allowNull: true
        },
        restoredByRoleId: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        recycledByRoleId: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        deleteByRoleId: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        originalLocation: {
            type: Sequelize.TEXT,
            allowNull: false
        },
        roleId: {
            type: Sequelize.INTEGER,
            allowNull: true
        }
    },
        {
            paranoid: true,
            tableName: 'generic_recycle_bin',
            timestamps: false
        });

    GenericRecycleBin.associate = (models) => {
        GenericRecycleBin.hasMany(models.GenericRecycleBinTrans, {
            foreignKey: 'refRecycleBinID',
            as: 'generic_recycle_bin_trans'
        });
    };

    return GenericRecycleBin;
};
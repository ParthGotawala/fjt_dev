/* eslint-disable global-require */
const Sequelize = require('sequelize');

module.exports = (sequelize) => {
    const GenericFolder = sequelize.define('GenericFolder', {
        gencFolderID: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER
        },
        gencFolderName: {
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
        roleId: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        refParentId: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        isDeleted: {
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
        },
        copyGencFolderID: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        refCopyTransID: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        refCopyGencFileOwnerType: {
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
        isRecycle: {
            type: Sequelize.BOOLEAN,
            allowNull: true,
            defaultValue: false
        }
    },
        {
            paranoid: true,
            tableName: 'generic_folder'
        });

    GenericFolder.associate = (models) => {
        GenericFolder.belongsTo(models.Role, {
            foreignKey: 'roleId',
            as: 'roles'
        });
        GenericFolder.hasMany(models.GenericFiles, {
            foreignKey: 'refParentId',
            as: 'genericfiles'
        });
    };

    return GenericFolder;
};
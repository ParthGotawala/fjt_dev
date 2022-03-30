const Sequelize = require('sequelize');

module.exports = (sequelize) => {
    const GenericFiles = sequelize.define('GenericFiles', {
        gencFileID: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER
        },
        gencFileName: {
            type: Sequelize.STRING,
            allowNull: true,
            validate: {
                notEmpty: true,
                len: [1, 100]
            }
        },
        gencOriginalName: {
            type: Sequelize.STRING,
            allowNull: true,
            validate: {
                notEmpty: true,
                len: [1, 255]
            }
        },
        gencFileDescription: {
            type: Sequelize.TEXT,
            allowNull: true
        },
        gencFileExtension: {
            type: Sequelize.STRING,
            allowNull: true,
            validate: {
                notEmpty: true,
                len: [1, 100]
            }
        },
        gencFileType: {
            type: Sequelize.STRING,
            allowNull: true,
            validate: {
                notEmpty: true,
                len: [1, 100]
            }
        },
        tags: {
            type: Sequelize.STRING,
            allowNull: true
        },
        isDefault: {
            type: Sequelize.BOOLEAN,
            allowNull: true
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
            type: Sequelize.STRING,
            allowNull: true,
            validate: {
                notEmpty: true,
                len: [1, 255]
            }
        },
        isDeleted: {
            type: Sequelize.BOOLEAN,
            allowNull: true
        },
        isActive: {
            type: Sequelize.BOOLEAN,
            allowNull: true
        },
        genFilePath: {
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
        isShared: {
            type: Sequelize.BOOLEAN,
            allowNull: true
        },
        fileGroupBy: {
            type: Sequelize.STRING,
            allowNull: true
        },
        refParentId: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        fileSize: {
            type: Sequelize.BIGINT,
            allowNull: false
        },
        isDisable: {
            type: Sequelize.BOOLEAN,
            allowNull: true
        },
        disableOn: {
            type: Sequelize.DATE,
            allowNull: true
        },
        disableBy: {
            type: Sequelize.STRING,
            allowNull: true
        },
        disableReason: {
            type: Sequelize.STRING,
            allowNull: true
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
    }, {
            paranoid: true,
            tableName: 'genericfiles'
        });

    GenericFiles.associate = (models) => {
        GenericFiles.belongsTo(models.Equipment, {
            as: 'equipmentfiles',
            foreignKey: 'refTransID'
        });
        GenericFiles.belongsTo(models.GenericFolder, {
            as: 'generic_folder',
            foreignKey: 'refParentId'
        });
    };

    return GenericFiles;
};

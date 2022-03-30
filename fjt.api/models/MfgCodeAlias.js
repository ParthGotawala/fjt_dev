const Sequelize = require('sequelize');

module.exports = (sequelize) => {
    const MfgCodeAlias = sequelize.define('MfgCodeAlias', {
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER
        },
        mfgcodeId: {
            allowNull: false,
            type: Sequelize.INTEGER
        },
        alias: {
            allowNull: true,
            type: Sequelize.STRING,
            validate: {
                notEmpty: true,
                len: [0, 255]
            }
        },
        mfgType: {
            allowNull: false,
            type: Sequelize.STRING
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
        systemGenerated: {
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
    }, {
        paranoid: true,
        tableName: 'mfgCodeAlias'
    });

    MfgCodeAlias.associate = (models) => {
        MfgCodeAlias.belongsTo(models.MfgCodeMst, {
            as: 'mfgCodemst',
            foreignKey: 'mfgcodeId'
        });

        MfgCodeAlias.belongsTo(models.User, {
            as: 'user',
            foreignKey: 'createdBy'
        });
        MfgCodeAlias.hasMany(models.InvalidMfgMappingMst, {
            as: 'invalidMfgMapping',
            foreignKey: 'refmfgAliasID'
        });
    };

    return MfgCodeAlias;
};
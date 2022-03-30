const Sequelize = require('sequelize');

module.exports = (sequelize) => {
    const ComponentFieldsGenericaliasMst = sequelize.define('ComponentFieldsGenericaliasMst', {
        id: {
            type: Sequelize.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true
        },
        refTableName: {
            type: Sequelize.STRING,
            allowNull: true
        },
        refId: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        alias: {
            type: Sequelize.STRING,
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
    },
        {
            paranoid: true,
            tableName: 'component_fields_genericalias_mst'
        });

    ComponentFieldsGenericaliasMst.associate = (models) => {
        ComponentFieldsGenericaliasMst.belongsTo(models.CountryMst, {
            as: 'countryMst',
            foreignKey: 'refId'
        });
        ComponentFieldsGenericaliasMst.belongsTo(models.ComponentPackagingMst, {
            as: 'Component_PackagingMst',
            foreignKey: 'refId'
        });
        ComponentFieldsGenericaliasMst.hasMany(models.ComponentAttributesSourceMapping, {
            foreignKey: 'refAliasID',
            as: 'componentAttributesSourceMapping'
        });
    };

    return ComponentFieldsGenericaliasMst;
};
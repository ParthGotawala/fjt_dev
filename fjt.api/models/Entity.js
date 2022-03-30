const Sequelize = require('sequelize');

module.exports = (sequelize) => {
    const Entity = sequelize.define('Entity', {
        entityID: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER
        },
        entityName: {
            type: Sequelize.STRING,
            allowNull: false,
            validate: {
                notEmpty: true,
                len: [1, 50]
            }
        },
        remark: {
            type: Sequelize.STRING,
            allowNull: true
        },
        isActive: {
            type: Sequelize.BOOLEAN,
            allowNull: true
            // defaultValue: true
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
        systemGenerated: {
            type: Sequelize.BOOLEAN
        },
        columnView: {
            allowNull: true,
            type: Sequelize.INTEGER
        },
        entityStatus: {
            allowNull: true,
            type: Sequelize.INTEGER
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
        displayName: {
            type: Sequelize.STRING,
            allowNull: true
        },
        jsonObjOfEnterprise: {
            type: Sequelize.JSON,
            allowNull: true
        },
        searchDisplayOrder: {
            type: Sequelize.DECIMAL(10, 5),
            allowNull: true
        },
        isDataEntity: {
            type: Sequelize.BOOLEAN,
            allowNull: true
        }
    }, {
        paranoid: true,
        indexes: [{
            unique: true,
            fields: ['entityName']
        }],
        tableName: 'entity'
    });

    Entity.associate = (models) => {
        Entity.hasMany(models.DataElement, {
            as: 'dataElement',
            foreignKey: 'entityID'
        });
        Entity.hasMany(models.DynamicReportAccess, {
            foreignKey: 'refTransID',
            as: 'dynamicReportAccess'
        });
    };

    return Entity;
};

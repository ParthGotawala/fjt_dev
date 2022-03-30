const Sequelize = require('sequelize');

module.exports = (sequelize) => {
    const ComponentRequireMountingType = sequelize.define('ComponentRequireMountingType', {
        id: {
            type: Sequelize.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true
        },
        refComponentID: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        partTypeID: {
            type: Sequelize.INTEGER,
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
        tableName: 'component_requiremountingtype'
    });

    ComponentRequireMountingType.associate = (models) => {
        ComponentRequireMountingType.belongsTo(models.RFQMountingType, {
            as: 'rfq_mountingtypemst',
            foreignKey: 'partTypeID'
        });

        ComponentRequireMountingType.belongsTo(models.Component, {
            as: 'component',
            foreignKey: 'refComponentID'
        });
    };

    return ComponentRequireMountingType;
};
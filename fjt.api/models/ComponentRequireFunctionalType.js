const Sequelize = require('sequelize');

module.exports = (sequelize) => {
    const ComponentRequireFunctionalType = sequelize.define('ComponentRequireFunctionalType', {
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
        tableName: 'component_requirefunctionaltype'
    });

    ComponentRequireFunctionalType.associate = (models) => {
        ComponentRequireFunctionalType.belongsTo(models.RFQPartType, {
            as: 'rfq_parttypemst',
            foreignKey: 'partTypeID'
        });

        ComponentRequireFunctionalType.belongsTo(models.Component, {
            as: 'component',
            foreignKey: 'refComponentID'
        });
    };
    return ComponentRequireFunctionalType;
};
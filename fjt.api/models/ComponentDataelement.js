const Sequelize = require('sequelize');

module.exports = (sequelize) => {
    const ComponentDataelement = sequelize.define('ComponentDataelement', {
        compDataElementID: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER
        },
        componentID: {
            type: Sequelize.INTEGER,
            allowNull: false,
            validate: {
                notEmpty: true,
                len: [1, 11]
            }
        },
        dataElementID: {
            type: Sequelize.INTEGER,
            allowNull: false,
            validate: {
                notEmpty: true,
                len: [1, 11]
            }
        },
        displayOrder: {
            type: Sequelize.DECIMAL(6, 2),
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
        }

    }, {
        paranoid: true,
        tableName: 'component_dataelement'
    });

    ComponentDataelement.associate = (models) => {
        ComponentDataelement.belongsTo(models.DataElement, {
            as: 'dataElement',
            foreignKey: 'dataElementID'
        });
        ComponentDataelement.belongsTo(models.Component, {
            as: 'component',
            foreignKey: 'componentID'
        });
    };

    return ComponentDataelement;
};

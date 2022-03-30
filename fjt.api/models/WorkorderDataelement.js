const Sequelize = require('sequelize');

module.exports = (sequelize) => {
    const WorkorderDataelement = sequelize.define('WorkorderDataelement', {
        woDataElementID: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER
        },
        woID: {
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
        tableName: 'workorder_dataelement'
    });

    WorkorderDataelement.associate = (models) => {
        WorkorderDataelement.belongsTo(models.DataElement, {
            as: 'DataElement',
            foreignKey: 'dataElementID'
        });

        WorkorderDataelement.belongsToMany(models.Workorder, {
            as: 'dataelements',
            through: 'workorderDataelement',
            foreignKey: 'opID'
        });
    };

    return WorkorderDataelement;
};

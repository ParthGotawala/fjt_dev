const Sequelize = require('sequelize');

module.exports = (sequelize) => {
    const OperationDataelement = sequelize.define('OperationDataelement', {
        opDataElementID: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER
        },
        opID: {
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
        tableName: 'operation_dataelement'
    });

    OperationDataelement.associate = (models) => {
        OperationDataelement.belongsTo(models.DataElement, {
            as: 'DataElement',
            foreignKey: 'dataElementID'
        });

        // OperationDataelement.belongsToMany(models.Operation, {
        //     as: 'dataelements',
        //     foreignKey: 'opID',
        //     through: 'operationDataelement'
        // });
    };

    return OperationDataelement;
};

const Sequelize = require('sequelize');

module.exports = (sequelize) => {
    const EquipmentDataelement = sequelize.define('EquipmentDataelement', {
        eqpDataElementID: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER
        },
        eqpID: {
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
        tableName: 'equipment_dataelement'
    });

    EquipmentDataelement.associate = (models) => {
        EquipmentDataelement.belongsTo(models.DataElement, {
            as: 'dataElement',
            foreignKey: 'dataElementID'
        });
        EquipmentDataelement.belongsTo(models.Equipment, {
            as: 'equipment',
            foreignKey: 'eqpID'
        });
    };

    return EquipmentDataelement;
};

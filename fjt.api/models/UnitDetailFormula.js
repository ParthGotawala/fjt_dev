const Sequelize = require('sequelize');

module.exports = (sequelize) => {
    const UnitDetailFormula = sequelize.define('UnitDetailFormula', {
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER
        },
        unitID: {
            allowNull: false,
            type: Sequelize.INTEGER
        },
        toUnitID: {
            allowNull: false,
            type: Sequelize.INTEGER
        },
        formula: {
            type: Sequelize.STRING(200),
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
            tableName: 'unit_detail_formula',
            paranoid: true
        });

    UnitDetailFormula.associate = (models) => {
        UnitDetailFormula.belongsTo(models.UOMs, {
            foreignKey: 'unitID',
            as: 'uom'
        });
        UnitDetailFormula.belongsTo(models.UOMs, {
            foreignKey: 'toUnitID',
            as: 'touom'
        });
    };

    return UnitDetailFormula;
};

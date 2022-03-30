const Sequelize = require('sequelize');

module.exports = (sequelize) => {
    const UOMs = sequelize.define('UOMs', {
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER
        },
        measurementTypeID: {
            allowNull: false,
            type: Sequelize.INTEGER
        },
        unitName: {
            type: Sequelize.STRING,
            allowNull: false
        },
        abbreviation: {
            type: Sequelize.STRING,
            allowNull: true
        },
        perUnit: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        baseUnitID: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        baseUnitConvertValue: {
            type: Sequelize.FLOAT,
            allowNull: true
        },
        isFormula: {
            type: Sequelize.BOOLEAN,
            allowNull: true
        },
        description: {
            type: Sequelize.STRING,
            allowNull: true
        },
        isDefault: {
            type: Sequelize.BOOLEAN,
            allowNull: true
        },
        isSystemDefault: {
            type: Sequelize.BOOLEAN,
            allowNull: true
        },
        ord: {
            type: Sequelize.DECIMAL(10, 5),
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
        defaultUOM: {
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
        },
        operator: {
            type: Sequelize.STRING,
            allowNull: true
        },
        orgBaseUnitValue: {
            type: Sequelize.FLOAT,
            allowNull: true
        }
    },
        {
            tableName: 'uoms',
            paranoid: true
        });

    UOMs.associate = (models) => {
        UOMs.belongsTo(models.MeasurementType, {
            foreignKey: 'measurementTypeID',
            as: 'measurementType'
        });
        UOMs.belongsTo(models.UOMs, {
            foreignKey: 'baseUnitID',
            as: 'uomsdetail'
        });
        UOMs.hasMany(models.UnitDetailFormula, {
            foreignKey: 'unitID',
            as: 'unit_detail_formula'
        });

        UOMs.hasMany(models.RFQLineItems, {
            as: 'rfqLineItems',
            foreignKey: 'uomID'
        });

        UOMs.hasMany(models.RFQConsolidatedMFGPNLineItem, {
            as: 'rfqConsolidatedMFGPNLineItem',
            foreignKey: 'uomID'
        });

        UOMs.hasMany(models.Component, {
            as: 'Component',
            foreignKey: 'uom'
        });
        UOMs.hasMany(models.Component, {
            as: 'grossWgtComponent',
            foreignKey: 'grossWeightUom'
        });
        UOMs.hasMany(models.Component, {
            as: 'packagingWgtComponent',
            foreignKey: 'packagingWeightUom'
        });
        UOMs.hasMany(models.ComponentFieldsGenericaliasMst, {
            as: 'alias',
            foreignKey: 'refId'
        });
    };

    return UOMs;
};

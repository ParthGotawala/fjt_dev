const Sequelize = require('sequelize');

module.exports = (sequelize) => {
    const MeasurementType = sequelize.define('MeasurementType', {
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER
        },
        name: {
            type: Sequelize.STRING,
            allowNull: false
        },
        isActive: {
            type: Sequelize.BOOLEAN,
            allowNull: true
        },
        displayOrder: {
            type: Sequelize.DECIMAL(10, 5),
            allowNull: true
        },
        refTypeID: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        isDefault: {
            type: Sequelize.BOOLEAN,
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
            tableName: 'measurement_types',
            paranoid: true
        });

    MeasurementType.associate = (models) => {
        MeasurementType.belongsTo(models.MeasurementType, {
            foreignKey: 'refTypeID',
            as: 'measurementType'
        });
        MeasurementType.hasMany(models.Component, {
            foreignKey: 'uomClassID',
            as: 'component'
        });
        MeasurementType.hasMany(models.UOMs, {
            foreignKey: 'measurementTypeID',
            as: 'unitMeasurement'
        });
    };

    return MeasurementType;
};

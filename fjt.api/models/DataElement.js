/* eslint-disable global-require */
module.exports = (sequelize) => {
    const Sequelize = require('sequelize');
    const DataElement = sequelize.define('DataElement', {
        dataElementID: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER
        },
        entityID: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        dataElementName: {
            type: Sequelize.STRING,
            allowNull: false,
            validate: {
                notEmpty: true,
                len: [1, 100]
            }
        },
        controlTypeID: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        defaultValue: {
            type: Sequelize.TEXT,
            allowNull: true
        },
        displayOrder: {
            type: Sequelize.DECIMAL(6, 2),
            allowNull: true
        },
        maxLength: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        isRequired: {
            type: Sequelize.BOOLEAN,
            allowNull: true
        },
        formatMask: {
            type: Sequelize.STRING,
            allowNull: true
        },
        decimal_number: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        rangeFrom: {
            type: Sequelize.DECIMAL(14, 6),
            allowNull: true,
            validate: {
                notEmpty: true,
                len: [1, 15]
            }
        },
        rangeTo: {
            type: Sequelize.DECIMAL(14, 6),
            allowNull: true,
            validate: {
                notEmpty: true,
                len: [1, 15]
            }
        },
        description: {
            type: Sequelize.STRING,
            allowNull: true,
            validate: {
                notEmpty: true,
                len: [1, 200]
            }
        },
        isActive: {
            type: Sequelize.BOOLEAN,
            allowNull: true
        },
        isDeleted: {
            type: Sequelize.BOOLEAN,
            allowNull: true
        },
        fromDate: {
            type: Sequelize.DATE,
            allowNull: true
        },
        toDate: {
            type: Sequelize.DATE,
            allowNull: true
        },
        fileType: {
            type: Sequelize.TEXT,
            allowNull: true
        },
        fileSize: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        parentDataElementID: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        tooltip: {
            type: Sequelize.STRING,
            allowNull: true
        },
        recurring_limit: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        dateTimeType: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        dataelement_use_at: {
            type: Sequelize.STRING,
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
        isUnique: {
            type: Sequelize.BOOLEAN,
            allowNull: true
        },
        isAutoIncrement: {
            type: Sequelize.BOOLEAN,
            allowNull: true
        },
        isDatasource: {
            type: Sequelize.BOOLEAN,
            allowNull: true
        },
        datasourceID: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        datasourceDisplayColumnID: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        isFixedEntity: {
            type: Sequelize.BOOLEAN,
            allowNull: true
        },
        validationExpr: {
            type: Sequelize.TEXT,
            allowNull: true
        },
        validationExprSuccessMsg: {
            type: Sequelize.STRING,
            allowNull: true,
            validate: {
                len: [0, 255]
            }
        },
        validationExprErrorMsg: {
            type: Sequelize.STRING,
            allowNull: true,
            validate: {
                len: [0, 255]
            }
        },
        isManualData: {
            type: Sequelize.BOOLEAN,
            allowNull: true
        },
        fieldWidth: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        isHideLabel: {
            type: Sequelize.BOOLEAN,
            allowNull: true
        }
    }, {
        paranoid: true,
        indexes: [{
            unique: true,
            fields: ['dataElementName', 'entityID']
        }],
        tableName: 'dataelement'
    });

    DataElement.associate = (models) => {
        // DataElement.belongsToMany(models.DataElementKeyValues, {
        //    as: 'dataelement_keyvalues',
        //    through: 'dataelement_keyvalues',
        //    foreignKey: 'dataElementID',
        // });
        DataElement.hasMany(models.DataElementKeyValues, {
            foreignKey: 'dataElementID',
            as: 'dataElementKeyValues'
        });
        DataElement.hasMany(models.OperationDataelement, {
            foreignKey: 'dataElementID',
            as: 'operationDataelement'
        });
        DataElement.hasMany(models.EquipmentDataelement, {
            foreignKey: 'dataElementID',
            as: 'equipmentDataelement'
        });
        DataElement.hasMany(models.WorkorderDataelement, {
            foreignKey: 'dataElementID',
            as: 'workorderDataelement'
        });
        DataElement.hasMany(models.WorkorderOperationDataelement, {
            foreignKey: 'dataElementID',
            as: 'workorderOperationDataelement'
        });
        DataElement.hasMany(models.WorkorderOperationEquipmentDataelement, {
            foreignKey: 'dataElementID',
            as: 'workorderOperationEquipmentDataelement'
        });
        DataElement.hasMany(models.ComponentDataelement, {
            foreignKey: 'dataElementID',
            as: 'componentDataelement'
        });
        DataElement.belongsTo(models.DataElement, {
            as: 'datasourceDisplayColumnDataElement',
            foreignKey: 'datasourceDisplayColumnID'
        });
        DataElement.hasMany(models.DataElementTransactionValuesManual, {
            foreignKey: 'dataElementID',
            as: 'dataElementTransactionValuesManual'
        });
        DataElement.hasMany(models.BRLabelTemplateDelimiter, {
            foreignKey: 'dataElementId',
            as: 'dataelement'
        });
        DataElement.hasMany(models.RFQAssyDataElementTransactionValuesHistory, {
            foreignKey: 'dataElementId',
            as: 'RFQAssyDataElementTransactionValuesHistory'
        });
    };

    return DataElement;
};

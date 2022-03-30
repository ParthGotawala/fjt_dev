const Sequelize = require('sequelize');

module.exports = (sequelize) => {
    const ReportMaster = sequelize.define('ReportMaster', {
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER
        },
        reportName: {
            type: Sequelize.STRING,
            allowNull: true
        },
        rdlcReportFileName: {
            type: Sequelize.STRING,
            allowNull: true
        },
        reportTitle: {
            type: Sequelize.STRING,
            allowNull: true
        },
        customerID: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        partID: {
            type: Sequelize.BOOLEAN,
            allowNull: true
        },
        companyID: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        fromDate: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        toDate: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        logicalExpression: {
            type: Sequelize.STRING,
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
        withAlternateParts: {
            type: Sequelize.BOOLEAN,
            allowNull: true
        },
        customerSelectType: {
            type: Sequelize.BOOLEAN,
            allowNull: true
        },
        partSelectType: {
            type: Sequelize.BOOLEAN,
            allowNull: true
        },
        employeeID: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        employeeSelectType: {
            type: Sequelize.BOOLEAN,
            allowNull: true
        },
        supplierID: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        supplierSelectType: {
            type: Sequelize.BOOLEAN,
            allowNull: true
        },
        mfgCodeID: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        mfgCodeSelectType: {
            type: Sequelize.BOOLEAN,
            allowNull: true
        },
        assyID: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        assySelectType: {
            type: Sequelize.BOOLEAN,
            allowNull: true
        },
        mountingTypeID: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        mountingTypeSelectType: {
            type: Sequelize.BOOLEAN,
            allowNull: true
        },
        functionalTypeID: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        functionalTypeSelectType: {
            type: Sequelize.BOOLEAN,
            allowNull: true
        },
        partStatusID: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        partStatusSelectType: {
            type: Sequelize.BOOLEAN,
            allowNull: true
        },
        workorderID: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        workorderSelectType: {
            type: Sequelize.BOOLEAN,
            allowNull: true
        },
        operationID: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        operationSelectType: {
            type: Sequelize.BOOLEAN,
            allowNull: true
        },
        reportCategoryId: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        reportViewType: {
            type: Sequelize.BOOLEAN,
            allowNull: true
        },
        reportAPI: {
            type: Sequelize.STRING,
            allowNull: true
        },
        isExcel: {
            type: Sequelize.BOOLEAN,
            allowNull: true
        },
        emailTemplete: {
            type: Sequelize.INTEGER,
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
        fromTime: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        toTime: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        fileName: {
            allowNull: false,
            type: Sequelize.STRING(255)
        },
        isEndUserReport: {
            allowNull: true,
            type: Sequelize.BOOLEAN
        },
        draftFileName: {
            allowNull: true,
            type: Sequelize.STRING(255)
        },
        radioButtonFilter: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        additionalNotes: {
            type: Sequelize.STRING(2000),
            allowNull: true
        },
        isCSVReport: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        csvReportAPI: {
            type: Sequelize.TEXT,
            allowNull: true
        },
        refReportId: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        status: {
            type: Sequelize.STRING(1),
            allowNull: true
        },
        entityId: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        editingBy: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        startDesigningDate: {
            type: Sequelize.DATE,
            allowNull: true
        },
        reportGenerationType: {
            type: Sequelize.STRING(1),
            allowNull: true
        },
        reportVersion: {
            type: Sequelize.STRING(255),
            allowNull: true
        },
        isDefaultReport: {
            type: Sequelize.BOOLEAN,
            allowNull: true
        }
    }, {
        tableName: 'reportmaster',
        paranoid: true
    });

    ReportMaster.associate = (models) => {
        ReportMaster.hasMany(models.EmailScheduleMst, {
            foreignKey: 'reportID',
            as: 'EmailScheduleMst'
        });
        ReportMaster.belongsTo(models.Entity, {
            foreignKey: 'entityId',
            as: 'Entity'
        });
        ReportMaster.belongsTo(models.GenericCategory, {
            foreignKey: 'reportCategoryId',
            as: 'GenericCategory'
        });
        ReportMaster.hasMany(models.ReportChangeLogs, {
            foreignKey: 'reportId',
            as: 'Report_Change_Logs'
        });
        ReportMaster.hasMany(models.ReportViewerParameter, {
            foreignKey: 'reportId',
            as: 'ReportViewerParameter'
        });
        ReportMaster.hasMany(models.ReportMasterParameter, {
            foreignKey: 'reportId',
            as: 'ReportMasterParameter'
        });
    };

    return ReportMaster;
};

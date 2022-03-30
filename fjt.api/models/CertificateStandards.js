const Sequelize = require('sequelize');

module.exports = (sequelize) => {
    const CertificateStandards = sequelize.define('CertificateStandards', {
        certificateStandardID: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER
        },
        fullName: {
            type: Sequelize.STRING,
            allowNull: true,
            validate: {
                len: [1, 255]
            }
        },
        shortName: {
            type: Sequelize.STRING,
            allowNull: true,
            validate: {
                len: [1, 100]
            }
        },
        description: {
            type: Sequelize.TEXT,
            allowNull: true
            // validate: {
            //     len: [1, 1000]
            // },
        },
        standardInfo: {
            type: Sequelize.TEXT,
            allowNull: true
            // validate: {
            //     notEmpty: true,
            //     len: [1, 1000]
            // },
        },
        certificateDate: {
            allowNull: true,
            type: Sequelize.DATEONLY
        },
        displayOrder: {
            type: Sequelize.DECIMAL(6, 2),
            allowNull: true
        },
        priority: {
            type: Sequelize.DECIMAL(6, 2),
            allowNull: true
        },
        isDeleted: {
            type: Sequelize.BOOLEAN,
            allowNull: true
        },
        isActive: {
            type: Sequelize.BOOLEAN,
            allowNull: true
        },
        isCertified: {
            type: Sequelize.BOOLEAN,
            allowNull: true
        },
        standardTypeID: {
            allowNull: true,
            type: Sequelize.INTEGER
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
        passwordProtected: {
            type: Sequelize.BOOLEAN,
            allowNull: false
        },
        isRequired: {
            type: Sequelize.BOOLEAN,
            allowNull: true
        },
        cerificateNumber: {
            type: Sequelize.STRING,
            allowNull: true
        },
        cerificateIssueDate: {
            allowNull: true,
            type: Sequelize.DATEONLY

        },
        certificateSupplierID: {
            allowNull: true,
            type: Sequelize.INTEGER
        },
        isExportControlled: {
            allowNull: true,
            type: Sequelize.BOOLEAN
        },
        isRestrictDataAccess: {
            allowNull: true,
            type: Sequelize.BOOLEAN
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
        imageURL: {
            type: Sequelize.STRING,
            allowNull: true
        },
        documentPath: {
            type: Sequelize.STRING,
            allowNull: true
        }
    }, {
        paranoid: true,
        tableName: 'certificate_standards'
    });
    CertificateStandards.associate = (models) => {
        CertificateStandards.hasMany(models.WorkorderCertification, {
            foreignKey: 'certificateStandardID',
            as: 'workorderCertification'
        });
        CertificateStandards.belongsTo(models.GenericCategory, {
            as: 'standardType',
            foreignKey: 'standardTypeID'
        });
        CertificateStandards.belongsTo(models.MfgCodeMst, {
            as: 'customer',
            foreignKey: 'certificateSupplierID'
        });
        CertificateStandards.hasMany(models.StandardClass, {
            foreignKey: 'certificateStandardID',
            as: 'CertificateStandard_Class'
        });
        CertificateStandards.hasMany(models.ComponentStandardDetails, {
            foreignKey: 'certificateStandardID',
            as: 'certificateStandard'
        });
        CertificateStandards.hasMany(models.RFQAssyStandardClassDetail, {
            as: 'RFQAssyStandardClassDetail',
            foreignKey: 'standardID'
        });
        CertificateStandards.hasMany(models.StandardRole, {
            as: 'certificateStandardRole',
            foreignKey: 'standardID'
        });
        CertificateStandards.hasMany(models.EmployeeCertification, {
            foreignKey: 'certificateStandardID',
            as: 'employeeCertification'
        });

        //        Certicate_Standards.hasMany(models.Certicate_Standards, {
        //            foreignKey: 'certificateStandardID',
        //            as: 'certicate_standards',
        //        });
        //    },
    };


    return CertificateStandards;
};

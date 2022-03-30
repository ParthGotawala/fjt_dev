const Sequelize = require('sequelize');

module.exports = (sequelize) => {
    const EmployeeCertification = sequelize.define('EmployeeCertification', {
        id: {
            type: Sequelize.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true
        },
        employeeID: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        certificateStandardID: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        classID: {
            type: Sequelize.INTEGER,
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
        deletedAt: {
            type: Sequelize.DATE,
            allowNull: true
        }
    },
        {
            paranoid: true,
            tableName: 'employee_certification'
        });

    EmployeeCertification.associate = () => {
        // EmployeeCertification.belongsTo(models.Employee, {
        //    as: 'employee',
        //    foreignKey: 'employeeID',
        // });
        // EmployeeCertification.belongsTo(models.CertificateStandards, {
        //    as: 'certificateStandard',
        //    foreignKey:'certificateStandardID',
        // });
    };

    return EmployeeCertification;
};
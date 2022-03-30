/* eslint-disable global-require */
const Sequelize = require('sequelize');

module.exports = (sequelize) => {
    const ContactPerson = sequelize.define('ContactPerson', {
        personId: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER
        },
        //customerId: {
        //    type: Sequelize.INTEGER,
        //    allowNull: false,
        //    validate: {
        //        notEmpty: true,
        //        len: [1, 11]
        //    }
        //},
        refTransID: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        refTableName: {
            type: Sequelize.STRING,
            allowNull: true
        },
        firstName: {
            type: Sequelize.STRING,
            allowNull: true,
            validate: {
                notEmpty: true,
                len: [1, 255]
            }
        },
        lastName: {
            type: Sequelize.STRING,
            allowNull: true,
            validate: {
                notEmpty: true,
                len: [1, 255]
            }
        },
        email: {
            type: Sequelize.TEXT,
            allowNull: true
            // validate: {
            //    notEmpty: true,
            //    len: [1, 255]
            // }
        },
        division: {
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
        middleName: {
            type: Sequelize.STRING,
            allowNull: true,
            validate: {
                len: [0, 255]
            }
        },
        isDefault: {
            type: Sequelize.BOOLEAN,
            allowNull: true
        },
        systemGenerated: {
            type: Sequelize.BOOLEAN,
            allowNull: true
        },
        additionalComment: {
            type: Sequelize.STRING,
            allowNull: true
        },
        isPrimary: {
            type: Sequelize.BOOLEAN,
            allowNull: true
        },
        title: {
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
        },
        isActive: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
            defaultValue: false
        },
        phoneNumber: {
            type: Sequelize.TEXT,
            allowNull: true
        },
        mailToCategory: {
            type: Sequelize.STRING,
            allowNull: false,
            defaultValue: 'N'
        }
    }, {
        paranoid: true,
        tableName: 'contactperson'
    });

    ContactPerson.associate = (models) => {
        ContactPerson.hasMany(models.EmployeeContactPerson, {
            foreignKey: 'contactPersonId',
            as: 'employeeContactPerson'
        });
        //ContactPerson.belongsTo(models.MfgCodeMst, {
        //    as: 'customer',
        //    foreignKey: 'customerId'
        //});
        //ContactPerson.hasMany(models.SalesOrderMst, {
        //    foreignKey: 'contactPersonID',
        //    as: 'salesordermst'
        //});
        //ContactPerson.hasMany(models.CustomerPackingSlip, {
        //    foreignKey: 'contactPersonId',
        //    as: 'customerPackingSlip'
        //});
    };

    return ContactPerson;
};

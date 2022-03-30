const Sequelize = require('sequelize');

module.exports = (sequelize) => {
    const JobType = sequelize.define('JobType', {
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER
        },
        name: {
            type: Sequelize.STRING,
            allowNull: false,
            validate: {
                notEmpty: true,
                len: [1, 100]
            }
        },
        description: {
            type: Sequelize.STRING,
            allowNull: true,
            validate: {
                // notEmpty: false,
                len: [0, 100]
            }
        },
        shortname: {
            type: Sequelize.STRING,
            allowNull: true,
            validate: {
                len: [0, 50]
            }
        },
        isActive: {
            type: Sequelize.BOOLEAN,
            allowNull: true
        },
        termsandcondition: {
            type: Sequelize.TEXT,
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
        },
        isLaborCosting: {
            type: Sequelize.BOOLEAN,
            allowNull: true
        },
        isMaterialCosting: {
            type: Sequelize.BOOLEAN,
            allowNull: true
        }
    },
        {
            tableName: 'jobtype',
            paranoid: true
        }
    );

    JobType.associate = (models) => {
        JobType.hasMany(models.RFQAssemblies, {
            foreignKey: 'jobTypeID',
            as: 'rfqAssemblies'
        });
    };

    return JobType;
};

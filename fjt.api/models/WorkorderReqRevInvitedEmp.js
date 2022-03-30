const Sequelize = require('sequelize');

module.exports = (sequelize) => {
    const WorkorderReqRevInvitedEmp = sequelize.define('WorkorderReqRevInvitedEmp', {
        woRevReqInvitedID: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER
        },
        woRevReqID: {
            allowNull: true,
            type: Sequelize.INTEGER
        },
        woID: {
            allowNull: true,
            type: Sequelize.INTEGER
        },
        departmentID: {
            allowNull: true,
            type: Sequelize.INTEGER
        },
        employeeID: {
            allowNull: true,
            type: Sequelize.INTEGER
        },
        timeLine: {
            type: Sequelize.DATE,
            allowNull: true
        },
        isCompulsory: {
            type: Sequelize.BOOLEAN,
            allowNull: true
        },
        requestStatus: {
            type: Sequelize.STRING,
            allowNull: true,
            validate: {
                len: [0, 1]
            }
        },
        requstedEmployeeID: {
            allowNull: true,
            type: Sequelize.INTEGER
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
        createdAt: {
            type: Sequelize.DATE,
            allowNull: true
        },
        updatedAt: {
            type: Sequelize.DATE,
            allowNull: true
        },
        deletedAt: {
            type: Sequelize.DATE,
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
    }, {
        paranoid: true,
        tableName: 'workorder_reqrevinvitedemp'
    });

    WorkorderReqRevInvitedEmp.associate = (models) => {
        WorkorderReqRevInvitedEmp.belongsTo(models.Employee, {
            as: 'requstedEmployee',
            foreignKey: 'requstedEmployeeID'
        });
        WorkorderReqRevInvitedEmp.belongsTo(models.WorkorderReqForReview, {
            as: 'workorderReqForReview',
            foreignKey: 'woRevReqID'
        });
        WorkorderReqRevInvitedEmp.belongsTo(models.Employee, {
            as: 'employee',
            foreignKey: 'employeeID'
        });
        WorkorderReqRevInvitedEmp.belongsTo(models.Workorder, {
            as: 'workorder',
            foreignKey: 'woID'
        });
    };
    return WorkorderReqRevInvitedEmp;
};
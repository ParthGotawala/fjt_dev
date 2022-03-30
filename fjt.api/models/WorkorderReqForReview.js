const Sequelize = require('sequelize');

module.exports = (sequelize) => {
    const WorkorderReqForReview = sequelize.define('WorkorderReqForReview', {
        woRevReqID: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER
        },
        woID: {
            allowNull: false,
            type: Sequelize.INTEGER
        },
        opID: {
            allowNull: true,
            type: Sequelize.INTEGER
        },
        woOPID: {
            allowNull: true,
            type: Sequelize.INTEGER
        },
        reqGenEmployeeID: {
            allowNull: false,
            type: Sequelize.INTEGER
        },
        woAuthorID: {
            allowNull: false,
            type: Sequelize.INTEGER
        },
        requestType: {
            type: Sequelize.STRING,
            allowNull: false,
            validate: {
                notEmpty: true,
                len: [1, 1]
            }
        },
        changeType: {
            type: Sequelize.STRING,
            allowNull: true,
            validate: {
                len: [0, 3]
            }
        },
        threadTitle: {
            type: Sequelize.STRING,
            allowNull: false,
            validate: {
                notEmpty: true,
                len: [1, 1000]
            }
        },
        description: {
            type: Sequelize.TEXT,
            allowNull: false,
            validate: {
                notEmpty: true
            }
        },
        accRejStatus: {
            type: Sequelize.STRING,
            allowNull: true,
            validate: {
                len: [1, 1]
            }
        },
        accRejDate: {
            type: Sequelize.DATE,
            allowNull: true
        },
        accRejBy: {
            allowNull: true,
            type: Sequelize.INTEGER
        },
        woRevnumber: {
            type: Sequelize.STRING,
            allowNull: true,
            validate: {
                len: [0, 2]
            }
        },
        woOpRevNumber: {
            type: Sequelize.STRING,
            allowNull: true,
            validate: {
                len: [0, 2]
            }
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
        tableName: 'workorder_reqforreview'
    });

    WorkorderReqForReview.associate = (models) => {
        WorkorderReqForReview.belongsTo(models.Employee, {
            as: 'reqGenEmployee',
            foreignKey: 'reqGenEmployeeID'
        });
        WorkorderReqForReview.belongsTo(models.Employee, {
            as: 'woAuther',
            foreignKey: 'woAuthorID'
        });
        WorkorderReqForReview.belongsTo(models.Employee, {
            as: 'accRejEmployee',
            foreignKey: 'accRejBy'
        });
        WorkorderReqForReview.belongsTo(models.Workorder, {
            as: 'workorder',
            foreignKey: 'woID'
        });
        WorkorderReqForReview.belongsTo(models.Operation, {
            as: 'operation',
            foreignKey: 'opID'
        });
        WorkorderReqForReview.belongsTo(models.WorkorderOperation, {
            as: 'workorderOperation',
            foreignKey: 'woOPID'
        });

        WorkorderReqForReview.hasMany(models.WorkorderReqRevInvitedEmp, {
            as: 'workorderReqRevInvitedEmp',
            foreignKey: 'woRevReqID'
        });
        WorkorderReqForReview.hasMany(models.WorkorderReqRevComments, {
            as: 'workorderReqRevComments',
            foreignKey: 'woRevReqID'
        });
        WorkorderReqForReview.hasMany(models.WorkorderReqForReviewValues, {
            foreignKey: 'woRevReqID',
            as: 'workorder_reqforreview_values'
        });
    };

    return WorkorderReqForReview;
};

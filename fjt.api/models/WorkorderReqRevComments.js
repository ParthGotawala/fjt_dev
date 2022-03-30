const Sequelize = require('sequelize');

module.exports = (sequelize) => {
    const WorkorderReqRevComments = sequelize.define('WorkorderReqRevComments', {
        woRevReqcommID: {
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
        commentemployeeID: {
            allowNull: false,
            type: Sequelize.INTEGER
        },
        commentDate: {
            type: Sequelize.DATE,
            allowNull: true
        },
        description: {
            type: Sequelize.TEXT,
            allowNull: true
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
        refwoRevReqCommID: {
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
        tableName: 'workorder_reqrevcomments'
    });

    WorkorderReqRevComments.associate = (models) => {
        WorkorderReqRevComments.belongsTo(models.Employee, {
            as: 'accRejEmployee',
            foreignKey: 'accRejBy'
        });
        WorkorderReqRevComments.belongsTo(models.Employee, {
            as: 'commentEmployee',
            foreignKey: 'commentemployeeID'
        });
        WorkorderReqRevComments.belongsTo(models.WorkorderReqForReview, {
            as: 'workorderReqForReview',
            foreignKey: 'woRevReqID'
        });
        WorkorderReqRevComments.belongsTo(models.Workorder, {
            as: 'workorder',
            foreignKey: 'woID'
        });
    };

    return WorkorderReqRevComments;
};
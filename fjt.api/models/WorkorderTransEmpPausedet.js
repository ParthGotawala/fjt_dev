const Sequelize = require('sequelize');

module.exports = (sequelize) => {
    const WorkorderTransEmpPausedet = sequelize.define('WorkorderTransEmpPausedet', {
        woTransemppausedID: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER
        },
        woTransinoutID: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        pausedTime: {
            type: Sequelize.DATE,
            allowNull: true
        },
        resumeTime: {
            type: Sequelize.DATE,
            allowNull: true
        },
        totalTime: {
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
        tableName: 'workorder_trans_emp_pausedet'
    });

    WorkorderTransEmpPausedet.associate = (models) => {
        WorkorderTransEmpPausedet.belongsTo(models.WorkorderTransEmpinout, {
            as: 'workorderTransEmpinout',
            foreignKey: 'woTransinoutID'
        });
    };

    return WorkorderTransEmpPausedet;
};

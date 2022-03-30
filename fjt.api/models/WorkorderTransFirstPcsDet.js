const Sequelize = require('sequelize');

module.exports = (sequelize) => {
    const WorkorderTransFirstPcsDet = sequelize.define('WorkorderTransFirstPcsDet', {
        woTransFirstpcsDetID: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER
        },
        woTransFirstPieceID: {
            allowNull: false,
            type: Sequelize.INTEGER
        },
        serialno: {
            type: Sequelize.STRING,
            allowNull: true,
            validate: {
                len: [1, 50]
            }
        },
        issue: {
            type: Sequelize.TEXT,
            allowNull: true
        },
        resolution: {
            type: Sequelize.TEXT,
            allowNull: true
        },
        woOPID: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        employeeID: {
            type: Sequelize.INTEGER,
            allowNull: false
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
        remark: {
            type: Sequelize.STRING,
            allowNull: true
        }
    }, {
        paranoid: true,
        tableName: 'workorder_trans_firstpcsdet'
    });

    WorkorderTransFirstPcsDet.associate = (models) => {
        WorkorderTransFirstPcsDet.belongsTo(models.WorkorderOperationFirstPiece, {
            as: 'workorderOperationFirstpiece',
            foreignKey: 'woTransFirstPieceID'
        });
        WorkorderTransFirstPcsDet.belongsTo(models.WorkorderOperation, {
            as: 'workorderOperations',
            foreignKey: 'woOPID'
        });
    };

    return WorkorderTransFirstPcsDet;
};

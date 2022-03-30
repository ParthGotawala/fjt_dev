const Sequelize = require('sequelize');

module.exports = (sequelize) => {
    const WorkorderOperationFirstPiece = sequelize.define('WorkorderOperationFirstPiece', {
        wofirstpieceID: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER
        },
        woID: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        opID: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        woopID: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        prefixorsuffix: {
            type: Sequelize.BOOLEAN,
            allowNull: false
        },
        Presuffix: {
            type: Sequelize.STRING,
            allowNull: false,
            validate: {
                len: [1, 10]
            }
        },
        dateCode: {
            type: Sequelize.STRING,
            allowNull: true,
            validate: {
                len: [1, 50]
            }
        },
        noofDigit: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        serialno: {
            type: Sequelize.STRING,
            allowNull: false,
            validate: {
                len: [1, 50]
            }
        },
        currStatus: {
            type: Sequelize.STRING,
            allowNull: true,
            validate: {
                len: [1, 5]
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
        prefix: {
            type: Sequelize.STRING,
            allowNUll: true
        },
        suffix: {
            type: Sequelize.STRING,
            allowNUll: true
        },
        serialIntVal: {
            type: Sequelize.INTEGER,
            allowNUll: true
        },
        dateCodeFormat: {
            type: Sequelize.STRING,
            allowNUll: true
        }
    }, {
        paranoid: true,
        tableName: 'workorder_operation_firstpiece'
    });

    WorkorderOperationFirstPiece.associate = (models) => {
        WorkorderOperationFirstPiece.hasOne(models.WorkorderTransFirstPcsDet, {
            as: 'workorderTransFirstPcsDet',
            foreignKey: 'woTransFirstPieceID'
        });
        WorkorderOperationFirstPiece.belongsTo(models.WorkorderOperation, {
            as: 'workorderOperation',
            foreignKey: 'woOPID'
        });
    };

    return WorkorderOperationFirstPiece;
};

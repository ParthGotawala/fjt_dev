const Sequelize = require('sequelize');

module.exports = (sequelize) => {
    const ReasonMst = sequelize.define('ReasonMst', {
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER
        },
        reasonCategory: {
            type: Sequelize.STRING,
            allowNull: false,
            validate: {
                notEmpty: true,
                len: [1, 100]
            }
        },
        reason: {
            type: Sequelize.TEXT,
            allowNull: true
        },
        isActive: {
            type: Sequelize.BOOLEAN,
            allowNull: true
        },
        reason_type: {
            type: Sequelize.TEXT,
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
        }
    },
        {
            tableName: 'reasonmst',
            paranoid: true
        }
    );

    ReasonMst.associate = () => {
        // ReasonMst.hasMany(models.RFQAssemblies, {
        //     foreignKey: 'reasonID',
        //     as: 'rfqAssembly',
        // });
    };

    return ReasonMst;
};

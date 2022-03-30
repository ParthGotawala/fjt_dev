const Sequelize = require('sequelize');

module.exports = (sequelize) => {
    const GenericRecycleBinTrans = sequelize.define('GenericRecycleBinTrans', {
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
                len: [1, 255]
            }
        },
        refRecycleBinID:{
            type: Sequelize.INTEGER,
            allowNull: false,
            foreignKey: true 
        },
        refTransID: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        entityID: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        gencFileOwnerType: {
            type: Sequelize.STRING(255),
            allowNull: false
        },
        reftablename: {
            type: Sequelize.STRING(100),
            allowNull: false
        },
        refId: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        parentID: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        isDeleted: {
            type: Sequelize.BOOLEAN,
            allowNull: true
        },
        deletedAt: {
            type: Sequelize.DATE,
            allowNull: true
        },
        recycledBy: {
            type: Sequelize.STRING,
            allowNull: true
        },
        restoredBy: {
            type: Sequelize.STRING,
            allowNull: true
        },
        deletedBy: {
            type: Sequelize.STRING,
            allowNull: true
        },
        restoredByRoleId: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        recycledByRoleId: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        deleteByRoleId: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        roleId: {
            type: Sequelize.INTEGER,
            allowNull: true
        }
    }, {
            paranoid: true,
            tableName: 'generic_recycle_bin_trans',
            timestamps: false
        });

    GenericRecycleBinTrans.associate = (models) => {
        GenericRecycleBinTrans.belongsTo(models.GenericFolder, {
            as: 'generic_recycle_bin',
            foreignKey: 'refRecycleBinID'
        });
    };

    return GenericRecycleBinTrans;
};

const Sequelize = require('sequelize');

module.exports = (sequelize) => {
    const VUSubAssemblyCount = sequelize.define('VUSubAssemblyCount', {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true
        },
        partID: {
            type: Sequelize.INTEGER
        },
        subAssemblyCount: {
            type: Sequelize.INTEGER
        }
    },
        {
            paranoid: false,
            timestamps: false,
            tableName: 'vu_sub_assembly_count'
        });
    VUSubAssemblyCount.associate = (models) => {
        VUSubAssemblyCount.belongsTo(models.Component, {
            foreignKey: 'partID',
            as: 'ComponentDetail'
        });
    };
    return VUSubAssemblyCount;
};
module.exports = {
  up: queryInterface => {
    return queryInterface.removeColumn('meetups', 'old_description');
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('meetups', 'old_description',
      {
        type: Sequelize.STRING,
        allowNull: true,
      });
  },
};

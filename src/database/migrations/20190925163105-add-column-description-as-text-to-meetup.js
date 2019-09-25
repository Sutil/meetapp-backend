module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('meetups', 'description', Sequelize.TEXT);
  },

  down: queryInterface => {
    return queryInterface.removeColumn('meetups', 'description');
  },
};

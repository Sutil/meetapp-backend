module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('subscriptions', 'canceled_at', {
      type: Sequelize.DATE,
    });
  },

  down: queryInterface => {
    return queryInterface.removeColumn('subscriptions', 'caceled_at');
  },
};

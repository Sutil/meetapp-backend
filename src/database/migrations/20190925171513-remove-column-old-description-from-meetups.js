module.exports = {
  up: queryInterface => {
    return queryInterface.removeColumn('meetups', 'old_description');
  },

  down: queryInterface => {
    return queryInterface.addColumn('meetups', 'old_description');
  },
};

module.exports = {
  up: queryInterface => {
    return queryInterface.renameColumn(
      'meetups',
      'description',
      'old_description'
    );
  },

  down: queryInterface => {
    return queryInterface.renameColumn(
      'meetups',
      'old_description',
      'description'
    );
  },
};

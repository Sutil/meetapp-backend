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
      'meetup',
      'old_description',
      'description'
    );
  },
};

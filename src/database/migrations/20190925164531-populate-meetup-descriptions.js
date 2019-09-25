module.exports = {
  up: queryInterface => {
    return queryInterface.sequelize
      .query('select id, old_description from meetups', {
        type: queryInterface.sequelize.QueryTypes.SELECT,
      })
      .then(ob => {
        ob.forEach(value => {
          const sql = `update meetups set description = '${value.old_description}' where id = ${value.id}`;

          queryInterface.sequelize.query(sql);
        });
      });
  },

  down: queryInterface => {
    return queryInterface.sequelize.query(
      'update meetups set description = null'
    );
  },
};

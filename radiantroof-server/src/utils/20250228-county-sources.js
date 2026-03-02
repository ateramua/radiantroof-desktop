module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('CountySources', [
      {
        countyId: 'travis-tx',
        name: 'Travis County',
        state: 'TX',
        enabled: true,
        config: JSON.stringify({ baseUrl: 'https://tax-office.traviscountytx.gov' }),
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        countyId: 'dallas-tx',
        name: 'Dallas County',
        state: 'TX',
        enabled: true,
        config: JSON.stringify({ baseUrl: 'https://www.dallascounty.org/tax' }),
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('CountySources', null, {});
  }
};
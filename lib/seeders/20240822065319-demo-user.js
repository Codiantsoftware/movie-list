module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Check if the Users table exists
    const tableExists = await queryInterface
      .describeTable("Users")
      .catch(() => false);

    if (!tableExists) {
      // Create the Users table if it does not exist
      await queryInterface.createTable("Users", {
        id: {
          type: Sequelize.INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },
        email: {
          type: Sequelize.STRING,
          allowNull: false,
          unique: true,
        },
        password: {
          type: Sequelize.STRING,
          allowNull: false,
        },
        createdAt: {
          type: Sequelize.DATE,
          allowNull: false,
        },
        updatedAt: {
          type: Sequelize.DATE,
          allowNull: false,
        },
      });
    }

    // Insert data into the Users table
    await queryInterface.bulkInsert(
      "Users",
      [
        {
          email: "backend@mailinator.com",
          password:
            "$2a$10$NJlHndEURTC6HbF8.fw8cuJ4oAtxQ8X1Ox.8la0Twg0yjDuUPvBSS",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {},
    );
  },

  down: async (queryInterface) => {
    // Delete the data in the Users table
    await queryInterface.bulkDelete("Users", null, {});

    // Optionally, you can drop the table if needed
    // await queryInterface.dropTable('Users');
  },
};

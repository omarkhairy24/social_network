'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.sequelize.query(`
      CREATE TABLE "Follows" (
        "followerId" UUID NOT NULL,
        "followingId" UUID NOT NULL,
        "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY ("followerId", "followingId"),
        FOREIGN KEY ("followerId") REFERENCES "Users"("id") ON DELETE CASCADE,
        FOREIGN KEY ("followingId") REFERENCES "Users"("id") ON DELETE CASCADE
      );
    `);
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.sequelize.query(`DROP TABLE "Follows";`);
  }
};

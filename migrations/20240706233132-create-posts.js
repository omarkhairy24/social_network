'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.sequelize.query(`
      CREATE TABLE "Posts" (
        "id" BIGSERIAL PRIMARY KEY,
        "header" VARCHAR(255),
        "description" TEXT,
        "images" JSON,
        "userId" UUID NOT NULL,
        "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE CASCADE
      );
    `);
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.sequelize.query(`DROP TABLE "Posts";`);
  }
};

'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.sequelize.query(`
      CREATE TABLE "Comments" (
        "id" BIGSERIAL PRIMARY KEY,
        "userId" UUID NOT NULL,
        "postId" BIGINT NOT NULL,
        "comment" TEXT,
        "image" VARCHAR(255),
        "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE CASCADE,
        FOREIGN KEY ("postId") REFERENCES "Posts"("id") ON DELETE CASCADE
      );
    `);
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.sequelize.query(`DROP TABLE "Comments";`);
  }
};

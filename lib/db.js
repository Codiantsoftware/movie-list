// lib/db.js
import logger from "@/utils/logger";
import { Sequelize } from "sequelize";

const sequelize = new Sequelize(
  process.env.MYSQL_DATABASE,
  process.env.MYSQL_USER,
  process.env.MYSQL_PASSWORD,
  {
    host: process.env.MYSQL_HOST,
    dialect: "mysql",
  },
);

const syncDatabase = async () => {
  try {
    await sequelize.sync({ alter: true }); // `alter: true` will only apply changes
    logger("Database synced");
  } catch (error) {
    logger("Error syncing database:", error);
  }
};
syncDatabase();

export default sequelize;

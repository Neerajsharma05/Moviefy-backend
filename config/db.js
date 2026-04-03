import mysql from "mysql2/promise";

let db;

export const connectDB = async () => {
  try {
    db = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      port: process.env.DB_PORT,

      // 🔥 IMPORTANT (Railway fix)
      ssl: {
        rejectUnauthorized: false
      }
    });

    console.log("✅ DB Connected");
  } catch (error) {
    console.error("❌ DB Error:", error.message);
    process.exit(1);
  }
};

export const getDB = () => db;
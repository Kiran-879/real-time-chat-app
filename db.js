const mysql = require("mysql2");

const connection = mysql.createConnection({
  host: "localhost",
  user: "kiran",
  password: "1234",
  database: "chat_app"
});

connection.connect((err) => {
  if (err) {
    console.log("❌ Database connection failed");
    console.log(err.message);
    return;
  }

  console.log("✅ Connected to MySQL");
});

// 🔥 Export connection
module.exports = connection;
const pgp = require("pg-promise")();

// database configuration
const dbConfig = {
  host: "db",
  port: 5432,
  database: process.env.POSTGRES_DB,
  user: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
};

exports.db = pgp(dbConfig);

// Test DB
exports.db.connect().then(obj => {
  console.log("Database connection successful"); // you can view this message in the docker compose logs
  obj.done(); // success, release the connection;
}).catch(error => {
  console.log("ERROR:", error.message || error);
});

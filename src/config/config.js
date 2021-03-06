require("dotenv").config();
exports.DATABASE_URL =
  process.env.DATABASE_URL ||
  global.DATABASE_URL ||
  "mongodb://127.0.0.1:27017/gelp";
exports.TEST_DATABASE_URL =
  process.env.TEST_DATABASE_URL || "mongodb://127.0.0.1:27017/gelp-test";
exports.PORT = process.env.PORT || 8080;
exports.JWT_SECRET = process.env.JWT_SECRET || "testing";
exports.JWT_EXPIRY = process.env.JWT_EXPIRY || "3h";

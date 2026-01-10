require("dotenv").config();
const app = require("./app");

const PORT = process.env.PORT || 5000;
const NODE_ENV = process.env.NODE_ENV || "development";

const server = app.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════╗
║     E-Commerce Backend Server          ║
╚════════════════════════════════════════╝
  
  ✅ Server Running Successfully
  📍 Environment: ${NODE_ENV}
  🚀 Port: ${PORT}
  📝 URL: http://localhost:${PORT}
  
  ⏰ Started at: ${new Date().toLocaleString()}
  ════════════════════════════════════════
  `);
});

// Handle unhandled promise rejections
process.on("unhandledRejection", (err) => {
  console.error("❌ Unhandled Rejection:", err.message);
  server.close(() => process.exit(1));
});

// Handle uncaught exceptions
process.on("uncaughtException", (err) => {
  console.error("❌ Uncaught Exception:", err.message);
  process.exit(1);
});

const app = require('./app');
const config = require('./config/config');

const PORT = config.port;

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT} in ${config.env} mode`);
  console.log(`Health check available at http://localhost:${PORT}/health`);
}); 
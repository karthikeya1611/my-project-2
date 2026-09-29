// Health check controller to confirm server status

const getHealthStatus = (req, res) => {
  res.status(200).json({
    status: 'ok',
    message: 'SmartServe Backend API is running',
    timestamp: new Date().toISOString()
  });
};

module.exports = {
  getHealthStatus
};

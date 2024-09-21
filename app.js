const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { connectDB, authenticateDB } = require('./src/config/db');

// Import routes
const userRoutes = require('./src/routes/userRoutes');
const groupRoutes = require('./src/routes/groupRoutes');
const expenseRoutes = require('./src/routes/expenseRoutes');
const balanceRoutes = require('./src/routes/transactionRoutes');

// Initialize app
const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Database connection
(async () => {
  await connectDB();
  await authenticateDB();
})();

// Routes
app.use('/api/users', userRoutes);
app.use('/api/groups', groupRoutes);
app.use('/api/expenses', expenseRoutes);
app.use('/api/balances', balanceRoutes);

// Error Handling Middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send({
    error: 'Something went wrong!',
    message: err.message,
  });
});

// Handle 404 for undefined routes
app.use((req, res) => {
  res.status(404).send({
    message: 'Route not found!',
  });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

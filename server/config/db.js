const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error('MONGO_URI not found in environment variables. Check .env file.');
    }

    console.log('Attempting MongoDB connection... (URI masked for security)');
    console.log('URI starts with:', process.env.MONGO_URI.substring(0, 50) + '...');

    const conn = await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 30000, // 30s timeout
      socketTimeoutMS: 45000,
      maxPoolSize: 10,
      retryWrites: true,
      w: 'majority',
      bufferCommands: false,
      family: 4  // Use IPv4 only
    });

    console.log(`MongoDB Connected: ${conn.connection.host}`);
    console.log(`Database name: ${conn.connection.name}`);
  } catch (error) {
    console.error('MongoDB Connection Error:', error.message);
    console.error('Full error:', error);
    console.error('Possible fixes:');
    console.error('1. Check MONGO_URI in .env');
    console.error('2. Verify Atlas IP whitelist (add 0.0.0.0/0)');
    console.error('3. Check Atlas cluster status');
    console.error('4. Database user permissions');
    process.exit(1);
  }
};

module.exports = connectDB;

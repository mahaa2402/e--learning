// index.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcrypt');
require('dotenv').config();
const Admin = require('./models/Admin');
const authRoutes = require('./routes/auth');
const adminRoutes = require('./routes/Admin');
const courseRoutes = require('./routes/Course');
const employeeRoutes = require('./routes/Employee');
const assignedTaskRoutes = require('./routes/AssignedTask');
const progressRoutes = require('./routes/progressRoutes');
const assignedCourseProgressRoutes = require('./routes/AssignedCourseProgress');
const { createAssignedTask, getAssignedTasks, getAssignedTaskById, updateAssignedTaskProgress, deleteAssignedTask } = require('./controllers/Admin');
const certificateRoutes = require('./routes/CertificateRoutes'); // Fixed path to match actual filename



const app = express();


console.log('🔧 Starting E-learning Server...');

// Enhanced CORS configuration - More permissive for development
app.use(cors({
  origin: true, // Allow all origins for development
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-auth-token', 'X-Access-Token', 'X-Auth-Token', 'access-token'],
  credentials: true,
  optionsSuccessStatus: 200 // For legacy browser support
}));

// Body parsing middleware
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Enhanced debug middleware
app.use((req, res, next) => {
  console.log(`📝 ${req.method} ${req.url}`);
  console.log(`   Origin: ${req.headers.origin || 'No origin'}`);
  console.log(`   User-Agent: ${req.headers['user-agent'] || 'No user-agent'}`);
  if (req.method === 'POST' || req.method === 'PUT' || req.method === 'PATCH') {
    console.log(`   Body: ${JSON.stringify(req.body, null, 2)}`);
  }
  console.log('   ========================\n');
  next();
});

// MongoDB connection



//const mongoURI = "mongodb+srv://mahaashri:mahaashri%40123@e-learning-platform.wx1swy3.mongodb.net/elearning?retryWrites=true&w=majority"

// Create default admin account if none exists (for testing)
const createDefaultAdmin = async () => {
  try {
    const adminCount = await Admin.countDocuments();
    if (adminCount === 0) {
      const hashedPassword = await bcrypt.hash('admin123', 10);
      const defaultAdmin = new Admin({
        name: 'Default Admin',
        email: 'admin@elearning.com',
        password: hashedPassword
      });
      await defaultAdmin.save();
      console.log('✅ Default admin created - Email: admin@elearning.com, Password: admin123');
    }
  } catch (err) {
    console.error('❌ Error creating default admin:', err);
  }
};


// MongoDB connection with proper error handling
//const mongoURI = process.env.MONGO_URI //|| "mongodb+srv://mahaashri:mahaashri%40123@e-learning-platform.wx1swy3.mongodb.net/elearning?retryWrites=true&w=majority";

console.log('🔗 Attempting to connect to MongoDB...');
console.log('📡 Connection string:', process.env.MONGO_URI ? 'Present' : 'Missing');
console.log('🗄️ Database name:', process.env.MONGO_URI ? process.env.MONGO_URI.split('/').pop() : 'Unknown');

mongoose.connect(process.env.MONGO_URI, {
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
})
.then(async () => {
  console.log('✅ Connected to MongoDB Atlas');
  console.log('🗄️ Connected to database:', mongoose.connection.db.databaseName);
  
  // Check employee count on startup
  const Employee = require('./models/Employee');
  const employeeCount = await Employee.countDocuments();
  console.log(`👥 Current employee count in database: ${employeeCount}`);
  
  createDefaultAdmin();
})
.catch(err => {
  console.error('❌ MongoDB connection failed:', err);
  console.error('🔍 Connection details:', {
    uri: process.env.MONGO_URI ? 'Present' : 'Missing',
    error: err.message
  });
});
const videoUploadRoutes = require('./routes/VideoUpload');
app.use('/api/videos', videoUploadRoutes);

// Routes Setup
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes); // Admin routes at /api/admin/*
//app.use('/api/admin', adminRoutes); // ADDED: Also mount admin routes directly at /api/* for frontend compatibility
app.use('/api/courses', courseRoutes);
app.use('/api/employee', employeeRoutes);
app.use('/api', assignedTaskRoutes);
app.use('/api/progress', progressRoutes);
app.use('/api/assigned-course-progress', assignedCourseProgressRoutes);
app.use('/api/certificate', certificateRoutes);
app.use('/api/certificates', certificateRoutes);

app.use("/api/video", require("./routes/Videofetch"));

const videoFetch = require("./routes/Videofetch");
app.use("/api/video", videoFetch);


// Home route
app.get('/', (req, res) => {
  res.json({ 
    message: '🌐 E-learning backend is running...',
    timestamp: new Date().toISOString(),
    endpoints: [
      'GET /health',
      'POST /api/auth/register',
      'POST /api/auth/login',
      'GET /api/admin/*',
      'GET /api/courses/*',
      'GET /api/employees/*',
      'GET /api/assignedtasks',
      'GET /api/certificates/:id'
    ]
  });
});

// Health check route
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    database: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected',
    port: process.env.PORT || 5000
  });
});

// 404 Not Found handler
app.use((req, res) => {
  res.status(404).json({ 
    error: 'Route not found',
    method: req.method,
    path: req.originalUrl,
    timestamp: new Date().toISOString()
  });
});

// 500 Internal Server Error handler
app.use((err, req, res, next) => {
  console.error('💥 Unexpected error:', err);
  res.status(500).json({ 
    error: 'Internal Server Error',
    message: err.message,
    timestamp: new Date().toISOString()
  });
});

// Start server
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});




// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('\n🛑 Shutting down server...');
  server.close();
  await mongoose.connection.close();
  console.log('📴 Server and database connections closed');
  process.exit(0);
});

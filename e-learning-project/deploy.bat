@echo off
REM E-Learning Application Deployment Script for EC2 (Windows)
echo 🚀 Starting E-Learning Application Deployment on EC2...

REM Check if Docker is installed
docker --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Docker is not installed. Please install Docker Desktop first.
    echo 📥 Download from: https://www.docker.com/products/docker-desktop
    pause
    exit /b 1
)

REM Check if Docker Compose is installed
docker-compose --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Docker Compose is not installed. Please install Docker Compose first.
    pause
    exit /b 1
)

REM Create necessary directories
echo 📁 Creating necessary directories...
if not exist "mongodb-init" mkdir mongodb-init
if not exist "backend\uploads" mkdir backend\uploads
if not exist "logs" mkdir logs

REM Create MongoDB initialization script
echo 🗄️ Creating MongoDB initialization script...
(
echo // MongoDB initialization script
echo db = db.getSiblingDB^('elearning'^);
echo.
echo // Create collections
echo db.createCollection^('employees'^);
echo db.createCollection^('admins'^);
echo db.createCollection^('courses'^);
echo db.createCollection^('certificates'^);
echo db.createCollection^('userprogress'^);
echo db.createCollection^('commonuserprogress'^);
echo db.createCollection^('assignedtasks'^);
echo db.createCollection^('assignedcourseprogress'^);
echo db.createCollection^('assignedcourseprogresstimestamp'^);
echo.
echo // Create indexes
echo db.employees.createIndex^(^{ email: 1 ^}, ^{ unique: true ^}^);
echo db.admins.createIndex^(^{ email: 1 ^}, ^{ unique: true ^}^);
echo db.certificates.createIndex^(^{ employeeEmail: 1, courseTitle: 1 ^}^);
echo db.userprogress.createIndex^(^{ userEmail: 1, courseName: 1 ^}^);
echo.
echo print^('✅ Database initialized successfully!'^);
) > mongodb-init\init.js

REM Stop existing containers
echo 🛑 Stopping existing containers...
docker-compose down

REM Build and start services
echo 🏗️ Building and starting services...
docker-compose up --build -d

REM Wait for services to be ready
echo ⏳ Waiting for services to be ready...
timeout /t 30 /nobreak >nul

REM Check service status
echo 📊 Checking service status...
docker-compose ps

REM Show logs
echo 📋 Recent logs:
docker-compose logs --tail=50

echo ✅ Deployment completed!
echo.
echo 🌐 Application URLs:
echo    Frontend: http://localhost
echo    Backend API: http://localhost:5000
echo    MongoDB: localhost:27017
echo.
echo 📊 Management Commands:
echo    View logs: docker-compose logs -f
echo    Restart: docker-compose restart
echo    Stop: docker-compose down
echo    Update: git pull ^&^& docker-compose up --build -d
echo.
echo 🔧 Default Admin Credentials:
echo    Email: admin@elearning.com
echo    Password: admin123
echo.
echo 🎉 Your E-Learning application is now running!
pause

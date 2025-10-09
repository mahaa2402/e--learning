#!/bin/bash

# E-Learning Application Deployment Script for EC2
echo "🚀 Starting E-Learning Application Deployment on EC2..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if running as root
if [[ $EUID -eq 0 ]]; then
   print_error "This script should not be run as root for security reasons"
   exit 1
fi

# Update system packages
print_status "📦 Updating system packages..."
sudo apt-get update && sudo apt-get upgrade -y

# Install essential packages
print_status "🔧 Installing essential packages..."
sudo apt-get install -y curl wget git unzip htop

# Install Docker if not installed
if ! command -v docker &> /dev/null; then
    print_status "🐳 Installing Docker..."
    curl -fsSL https://get.docker.com -o get-docker.sh
    sudo sh get-docker.sh
    sudo usermod -aG docker $USER
    rm get-docker.sh
    print_warning "Please log out and log back in for Docker group changes to take effect"
fi

# Install Docker Compose if not installed
if ! command -v docker-compose &> /dev/null; then
    print_status "🐳 Installing Docker Compose..."
    sudo curl -L "https://github.com/docker/compose/releases/download/v2.20.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
    sudo chmod +x /usr/local/bin/docker-compose
fi

# Configure firewall
print_status "🔥 Configuring firewall..."
sudo ufw allow 22/tcp   # SSH
sudo ufw allow 80/tcp   # HTTP
sudo ufw allow 443/tcp  # HTTPS
sudo ufw allow 5000/tcp # Backend API (optional)
sudo ufw --force enable

# Create necessary directories
print_status "📁 Creating necessary directories..."
mkdir -p mongodb-init
mkdir -p backend/uploads
mkdir -p logs

# Set proper permissions
print_status "🔐 Setting permissions..."
sudo chown -R $USER:$USER .
chmod +x deploy.sh

# Create MongoDB initialization script
print_status "🗄️ Creating MongoDB initialization script..."
cat > mongodb-init/init.js << 'EOF'
// MongoDB initialization script
db = db.getSiblingDB('elearning');

// Create collections
db.createCollection('employees');
db.createCollection('admins');
db.createCollection('courses');
db.createCollection('certificates');
db.createCollection('userprogress');
db.createCollection('commonuserprogress');
db.createCollection('assignedtasks');
db.createCollection('assignedcourseprogress');
db.createCollection('assignedcourseprogresstimestamp');

// Create indexes
db.employees.createIndex({ email: 1 }, { unique: true });
db.admins.createIndex({ email: 1 }, { unique: true });
db.certificates.createIndex({ employeeEmail: 1, courseTitle: 1 });
db.userprogress.createIndex({ userEmail: 1, courseName: 1 });

print('✅ Database initialized successfully!');
EOF

# Stop existing containers
print_status "🛑 Stopping existing containers..."
docker-compose down

# Remove old images (optional - uncomment if you want to force rebuild)
# print_status "🗑️ Removing old images..."
# docker-compose down --rmi all

# Build and start services
print_status "🏗️ Building and starting services..."
docker-compose up --build -d

# Wait for services to be ready
print_status "⏳ Waiting for services to be ready..."
sleep 30

# Check service status
print_status "📊 Checking service status..."
docker-compose ps

# Show logs
print_status "📋 Recent logs:"
docker-compose logs --tail=50

# Test health endpoints
print_status "🏥 Testing health endpoints..."
sleep 10

# Test backend health
if curl -f http://localhost:5000/api/health > /dev/null 2>&1; then
    print_status "✅ Backend health check passed"
else
    print_warning "⚠️ Backend health check failed"
fi

# Test frontend health
if curl -f http://localhost/health > /dev/null 2>&1; then
    print_status "✅ Frontend health check passed"
else
    print_warning "⚠️ Frontend health check failed"
fi

# Get EC2 public IP
PUBLIC_IP=$(curl -s http://169.254.169.254/latest/meta-data/public-ipv4 2>/dev/null || echo "your-ec2-public-ip")

print_status "✅ Deployment completed!"
echo ""
echo -e "${BLUE}🌐 Application URLs:${NC}"
echo -e "   Frontend: http://$PUBLIC_IP"
echo -e "   Backend API: http://$PUBLIC_IP:5000"
echo -e "   MongoDB: $PUBLIC_IP:27017"
echo ""
echo -e "${BLUE}📊 Management Commands:${NC}"
echo -e "   View logs: ${YELLOW}docker-compose logs -f${NC}"
echo -e "   Restart: ${YELLOW}docker-compose restart${NC}"
echo -e "   Stop: ${YELLOW}docker-compose down${NC}"
echo -e "   Update: ${YELLOW}git pull && docker-compose up --build -d${NC}"
echo ""
echo -e "${BLUE}🔧 Default Admin Credentials:${NC}"
echo -e "   Email: ${YELLOW}admin@elearning.com${NC}"
echo -e "   Password: ${YELLOW}admin123${NC}"
echo ""
print_status "🎉 Your E-Learning application is now running!"

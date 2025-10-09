#!/bin/bash

# EC2 Instance Setup Script for E-Learning Application
echo "🖥️ Setting up EC2 instance for E-Learning Application..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Update system
print_status "📦 Updating system packages..."
sudo apt-get update && sudo apt-get upgrade -y

# Install essential packages
print_status "🔧 Installing essential packages..."
sudo apt-get install -y curl wget git unzip htop tree

# Install Node.js (for development and debugging)
print_status "📦 Installing Node.js..."
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2 for process management (optional)
print_status "📦 Installing PM2..."
sudo npm install -g pm2

# Configure firewall
print_status "🔥 Configuring firewall..."
sudo ufw allow 22/tcp   # SSH
sudo ufw allow 80/tcp   # HTTP
sudo ufw allow 443/tcp  # HTTPS
sudo ufw allow 5000/tcp # Backend API
sudo ufw --force enable

# Create application directory
print_status "📁 Creating application directory..."
sudo mkdir -p /opt/elearning
sudo chown $USER:$USER /opt/elearning

# Create swap file (optional, for better performance)
print_status "💾 Creating swap file..."
sudo fallocate -l 2G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile
echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab

# Set up log rotation
print_status "📋 Setting up log rotation..."
sudo tee /etc/logrotate.d/docker-containers << 'EOF'
/var/lib/docker/containers/*/*.log {
    rotate 7
    daily
    compress
    size=1M
    missingok
    delaycompress
    copytruncate
}
EOF

# Create monitoring script
print_status "📊 Creating monitoring script..."
cat > /opt/elearning/monitor.sh << 'EOF'
#!/bin/bash
echo "=== E-Learning Application Status ==="
echo "Date: $(date)"
echo ""

echo "=== Docker Containers ==="
docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"

echo ""
echo "=== System Resources ==="
echo "CPU Usage:"
top -bn1 | grep "Cpu(s)" | sed "s/.*, *\([0-9.]*\)%* id.*/\1/" | awk '{print "CPU Load: " 100 - $1 "%"}'

echo "Memory Usage:"
free -h | awk 'NR==2{printf "Memory Usage: %s/%s (%.2f%%)\n", $3,$2,$3*100/$2 }'

echo "Disk Usage:"
df -h | awk '$NF=="/"{printf "Disk Usage: %d/%dGB (%s)\n", $3,$2,$5}'

echo ""
echo "=== Application Health ==="
if curl -f http://localhost/health > /dev/null 2>&1; then
    echo "✅ Frontend: Healthy"
else
    echo "❌ Frontend: Unhealthy"
fi

if curl -f http://localhost:5000/api/health > /dev/null 2>&1; then
    echo "✅ Backend: Healthy"
else
    echo "❌ Backend: Unhealthy"
fi

echo ""
echo "=== Recent Logs ==="
docker-compose logs --tail=10
EOF

chmod +x /opt/elearning/monitor.sh

# Create backup script
print_status "💾 Creating backup script..."
cat > /opt/elearning/backup.sh << 'EOF'
#!/bin/bash
BACKUP_DIR="/opt/elearning/backups"
DATE=$(date +%Y%m%d_%H%M%S)

mkdir -p $BACKUP_DIR

echo "Creating backup: elearning_backup_$DATE"

# Backup MongoDB
docker-compose exec -T mongodb mongodump --out /tmp/backup
docker cp elearning-mongodb:/tmp/backup $BACKUP_DIR/mongodb_backup_$DATE

# Backup uploads
if [ -d "backend/uploads" ]; then
    cp -r backend/uploads $BACKUP_DIR/uploads_backup_$DATE
fi

# Create archive
cd $BACKUP_DIR
tar -czf elearning_backup_$DATE.tar.gz mongodb_backup_$DATE uploads_backup_$DATE
rm -rf mongodb_backup_$DATE uploads_backup_$DATE

echo "Backup completed: $BACKUP_DIR/elearning_backup_$DATE.tar.gz"

# Keep only last 7 backups
ls -t elearning_backup_*.tar.gz | tail -n +8 | xargs -r rm

echo "Old backups cleaned up"
EOF

chmod +x /opt/elearning/backup.sh

# Set up cron jobs
print_status "⏰ Setting up cron jobs..."
(crontab -l 2>/dev/null; echo "0 2 * * * /opt/elearning/backup.sh") | crontab -
(crontab -l 2>/dev/null; echo "*/5 * * * * /opt/elearning/monitor.sh >> /opt/elearning/monitor.log 2>&1") | crontab -

print_status "✅ EC2 setup completed!"
echo ""
echo -e "${BLUE}📁 Application directory:${NC} /opt/elearning"
echo -e "${BLUE}📊 Monitoring script:${NC} /opt/elearning/monitor.sh"
echo -e "${BLUE}💾 Backup script:${NC} /opt/elearning/backup.sh"
echo ""
echo -e "${BLUE}🔧 Next steps:${NC}"
echo "   1. Upload your application files to /opt/elearning"
echo "   2. Run ./deploy.sh to start the application"
echo "   3. Monitor with: /opt/elearning/monitor.sh"
echo ""
echo -e "${BLUE}📋 Useful commands:${NC}"
echo "   Monitor: ${YELLOW}/opt/elearning/monitor.sh${NC}"
echo "   Backup: ${YELLOW}/opt/elearning/backup.sh${NC}"
echo "   View logs: ${YELLOW}docker-compose logs -f${NC}"
echo "   Restart: ${YELLOW}docker-compose restart${NC}"

# 🎓 E-Learning Application - Docker Deployment Guide

This guide will help you deploy the E-Learning application using Docker on an EC2 instance.

## 📋 Prerequisites

- AWS EC2 instance (Ubuntu 20.04+ recommended)
- SSH access to your EC2 instance
- Basic knowledge of Docker and Linux commands

## 🚀 Quick Deployment

### Option 1: Automated Deployment (Recommended)

1. **Upload your project to EC2:**
   ```bash
   scp -r e-learning-project/ ubuntu@your-ec2-ip:/opt/elearning/
   ```

2. **SSH into your EC2 instance:**
   ```bash
   ssh ubuntu@your-ec2-ip
   ```

3. **Navigate to the project directory:**
   ```bash
   cd /opt/elearning/e-learning-project
   ```

4. **Run the setup script:**
   ```bash
   chmod +x ec2-setup.sh deploy.sh
   ./ec2-setup.sh
   ```

5. **Deploy the application:**
   ```bash
   ./deploy.sh
   ```

### Option 2: Manual Deployment

1. **Install Docker and Docker Compose:**
   ```bash
   curl -fsSL https://get.docker.com -o get-docker.sh
   sudo sh get-docker.sh
   sudo usermod -aG docker $USER
   
   sudo curl -L "https://github.com/docker/compose/releases/download/v2.20.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
   sudo chmod +x /usr/local/bin/docker-compose
   ```

2. **Configure firewall:**
   ```bash
   sudo ufw allow 22/tcp   # SSH
   sudo ufw allow 80/tcp   # HTTP
   sudo ufw allow 5000/tcp # Backend API
   sudo ufw --force enable
   ```

3. **Start the application:**
   ```bash
   docker-compose up --build -d
   ```

## 🌐 Access Your Application

After successful deployment, your application will be available at:

- **Frontend:** `http://your-ec2-public-ip`
- **Backend API:** `http://your-ec2-public-ip:5000`
- **MongoDB:** `your-ec2-public-ip:27017`

## 🔧 Default Admin Credentials

- **Email:** `admin@elearning.com`
- **Password:** `admin123`

## 📊 Management Commands

### View Logs
```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f mongodb
```

### Restart Services
```bash
# All services
docker-compose restart

# Specific service
docker-compose restart backend
```

### Stop Services
```bash
docker-compose down
```

### Update Application
```bash
git pull
docker-compose up --build -d
```

### Monitor Resources
```bash
docker stats
```

## 🔍 Health Checks

The application includes health check endpoints:

- **Frontend:** `http://your-ec2-ip/health`
- **Backend:** `http://your-ec2-ip:5000/api/health`

## 📁 Project Structure

```
e-learning-project/
├── docker-compose.yml          # Main Docker Compose configuration
├── deploy.sh                   # Linux deployment script
├── deploy.bat                  # Windows deployment script
├── ec2-setup.sh               # EC2 instance setup script
├── env.example                 # Environment variables template
├── backend/
│   ├── Dockerfile             # Backend container configuration
│   ├── healthcheck.js         # Backend health check script
│   └── ...
├── frontend/
│   ├── Dockerfile             # Frontend container configuration
│   ├── nginx.conf             # Nginx configuration
│   └── ...
└── mongodb-init/
    └── init.js                # MongoDB initialization script
```

## 🔧 Configuration

### Environment Variables

Copy `env.example` to `.env` and modify as needed:

```bash
cp env.example .env
```

Key environment variables:
- `MONGO_URI`: MongoDB connection string
- `JWT_SECRET`: Secret key for JWT tokens
- `PORT`: Backend server port (default: 5000)
- `AWS_*`: AWS credentials for video uploads (optional)

### MongoDB Configuration

The MongoDB container is configured with:
- **Database:** `elearning`
- **Root User:** `admin`
- **Root Password:** `password123`
- **Port:** `27017`

### Nginx Configuration

The frontend uses Nginx with:
- React Router support
- API proxy to backend
- Gzip compression
- Security headers
- Rate limiting

## 🛠️ Troubleshooting

### Common Issues

1. **Port already in use:**
   ```bash
   sudo netstat -tulpn | grep :80
   sudo netstat -tulpn | grep :5000
   ```

2. **Permission denied:**
   ```bash
   sudo chown -R $USER:$USER .
   chmod +x deploy.sh
   ```

3. **Docker not found:**
   ```bash
   # Log out and log back in after adding user to docker group
   sudo usermod -aG docker $USER
   ```

4. **MongoDB connection failed:**
   ```bash
   # Check MongoDB container logs
   docker-compose logs mongodb
   ```

### Debug Commands

```bash
# Check container status
docker-compose ps

# Check resource usage
docker stats

# Check logs
docker-compose logs --tail=100

# Access container shell
docker-compose exec backend sh
docker-compose exec mongodb mongo
```

## 🔒 Security Considerations

1. **Change default passwords** in production
2. **Use HTTPS** with SSL certificates
3. **Configure proper CORS** origins
4. **Set up firewall rules** appropriately
5. **Regular security updates**

## 📈 Monitoring & Maintenance

### Automated Monitoring

The setup includes:
- Health checks for all services
- Log rotation
- Automated backups
- Resource monitoring

### Manual Monitoring

```bash
# Check application status
/opt/elearning/monitor.sh

# Create backup
/opt/elearning/backup.sh

# View system resources
htop
df -h
free -h
```

## 🆘 Support

If you encounter issues:

1. Check the logs: `docker-compose logs -f`
2. Verify container status: `docker-compose ps`
3. Test health endpoints
4. Check system resources
5. Review firewall settings

## 📝 Additional Notes

- The application automatically creates a default admin account
- MongoDB data persists in Docker volumes
- Uploads are stored in `backend/uploads/`
- Logs are available in Docker logs
- Backups are created daily at 2 AM

---

**Happy Learning! 🎓**

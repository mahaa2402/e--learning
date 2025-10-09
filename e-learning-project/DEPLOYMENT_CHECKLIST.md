# 🚀 E-Learning Application - Docker Deployment Checklist

## Pre-Deployment Checklist

### ✅ EC2 Instance Setup
- [ ] EC2 instance running Ubuntu 20.04+
- [ ] Security group allows ports 22, 80, 5000
- [ ] SSH access configured
- [ ] Instance has at least 2GB RAM and 20GB storage

### ✅ Application Files
- [ ] All source code uploaded to EC2
- [ ] Docker configuration files present
- [ ] Environment variables configured
- [ ] MongoDB initialization script ready

### ✅ Dependencies
- [ ] Docker installed
- [ ] Docker Compose installed
- [ ] User added to docker group
- [ ] Firewall configured

## Deployment Steps

### 1. Upload Application
```bash
# From your local machine
scp -r e-learning-project/ ubuntu@your-ec2-ip:/opt/elearning/
```

### 2. SSH into EC2
```bash
ssh ubuntu@your-ec2-ip
cd /opt/elearning/e-learning-project
```

### 3. Run Setup Script
```bash
chmod +x ec2-setup.sh deploy.sh
./ec2-setup.sh
```

### 4. Deploy Application
```bash
./deploy.sh
```

### 5. Verify Deployment
```bash
# Check container status
docker-compose ps

# Test endpoints
curl http://localhost/health
curl http://localhost:5000/api/health

# View logs
docker-compose logs -f
```

## Post-Deployment Verification

### ✅ Application Access
- [ ] Frontend accessible at `http://your-ec2-ip`
- [ ] Backend API accessible at `http://your-ec2-ip:5000`
- [ ] Health checks passing
- [ ] Default admin login works

### ✅ Database
- [ ] MongoDB container running
- [ ] Database initialized with collections
- [ ] Indexes created
- [ ] Default admin account created

### ✅ Services
- [ ] All containers healthy
- [ ] No error logs
- [ ] Resources usage normal
- [ ] Network connectivity working

## Configuration Files Created

### ✅ Docker Configuration
- [ ] `docker-compose.yml` - Main orchestration
- [ ] `backend/Dockerfile` - Backend container
- [ ] `frontend/Dockerfile` - Frontend container
- [ ] `frontend/nginx.conf` - Web server config
- [ ] `.dockerignore` - Build optimization

### ✅ Deployment Scripts
- [ ] `deploy.sh` - Linux deployment script
- [ ] `deploy.bat` - Windows deployment script
- [ ] `ec2-setup.sh` - EC2 instance setup
- [ ] `backend/healthcheck.js` - Health monitoring

### ✅ Configuration Files
- [ ] `env.example` - Environment template
- [ ] `env.production` - Production config
- [ ] `mongodb-init/init.js` - Database init
- [ ] `frontend/src/config/api.js` - API config

## Default Credentials

### Admin Account
- **Email:** `admin@elearning.com`
- **Password:** `admin123`

### Database
- **Host:** `localhost:27017`
- **Database:** `elearning`
- **Username:** `admin`
- **Password:** `password123`

## Management Commands

### Monitoring
```bash
# Application status
docker-compose ps

# Resource usage
docker stats

# Health checks
curl http://localhost/health
curl http://localhost:5000/api/health

# Custom monitoring
/opt/elearning/monitor.sh
```

### Logs
```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f mongodb
```

### Maintenance
```bash
# Restart services
docker-compose restart

# Stop services
docker-compose down

# Update application
git pull && docker-compose up --build -d

# Create backup
/opt/elearning/backup.sh
```

## Troubleshooting

### Common Issues
1. **Port conflicts** - Check with `netstat -tulpn`
2. **Permission errors** - Run `chmod +x` on scripts
3. **Docker not found** - Log out/in after adding to docker group
4. **MongoDB connection** - Check container logs
5. **API not accessible** - Verify firewall and CORS settings

### Debug Commands
```bash
# Container shell access
docker-compose exec backend sh
docker-compose exec mongodb mongo

# Check network
docker network ls
docker network inspect elearning_elearning-network

# Check volumes
docker volume ls
docker volume inspect elearning_mongodb_data
```

## Security Checklist

### ✅ Production Security
- [ ] Change default passwords
- [ ] Use strong JWT secret
- [ ] Configure proper CORS origins
- [ ] Set up SSL/HTTPS
- [ ] Regular security updates
- [ ] Monitor logs for suspicious activity

### ✅ AWS Security
- [ ] Security groups properly configured
- [ ] IAM roles with minimal permissions
- [ ] Regular backups enabled
- [ ] Monitoring and alerting set up

## Performance Optimization

### ✅ Resource Management
- [ ] Appropriate instance size
- [ ] Swap file configured
- [ ] Log rotation enabled
- [ ] Automated backups scheduled

### ✅ Application Optimization
- [ ] Nginx caching enabled
- [ ] Gzip compression active
- [ ] Database indexes created
- [ ] Health checks configured

---

## 🎉 Deployment Complete!

Your E-Learning application is now running on EC2 with Docker!

**Access URLs:**
- Frontend: `http://your-ec2-public-ip`
- Backend: `http://your-ec2-public-ip:5000`

**Next Steps:**
1. Test all functionality
2. Configure SSL certificates
3. Set up monitoring alerts
4. Schedule regular backups
5. Update documentation

**Support:** Check logs with `docker-compose logs -f` if issues arise.

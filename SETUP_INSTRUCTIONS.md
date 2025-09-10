# Complete Visitor Management System Setup Guide

## Overview
This is a complete visitor management system with:
- **Frontend**: React with TypeScript, Tailwind CSS, and shadcn/ui components
- **Backend**: PHP with MySQL database
- **Deployment**: XAMPP on Windows 11

## Features
✅ Visitor check-in/check-out with form validation  
✅ Real-time active visitors dashboard  
✅ Comprehensive visitor history with search and filters  
✅ Analytics dashboard with charts and statistics  
✅ Professional corporate design  
✅ MySQL database with complete schema  
✅ PHP REST API with error handling  
✅ Audit logging and security features  

## Quick Start Guide

### 1. Install XAMPP
1. Download from: https://www.apachefriends.org/
2. Install to `C:\xampp\` (default location)
3. Start **Apache** and **MySQL** from XAMPP Control Panel

### 2. Setup Database
1. Open phpMyAdmin: http://localhost/phpmyadmin
2. Create database: `visitor_management`
3. Import the SQL file: `backend/database/visitor_management.sql`
   - Or copy-paste the SQL commands from the file

### 3. Deploy Backend
1. Create directory: `C:\xampp\htdocs\visitor-management\`
2. Copy the entire `backend/` folder to: `C:\xampp\htdocs\visitor-management\backend\`
3. Test API: http://localhost/visitor-management/backend/api/visitors.php

### 4. Build and Deploy Frontend
1. In your React project directory, run:
   ```bash
   npm run build
   ```
2. Copy the contents of `build/` folder to: `C:\xampp\htdocs\visitor-management\frontend\`

### 5. Configure API Connection
The React app is already configured to connect to: `http://localhost/visitor-management/backend/api`

If you need to change this, edit `src/lib/api.ts`:
```javascript
const API_BASE_URL = 'http://localhost/visitor-management/backend/api';
```

### 6. Access Your Application
- **Frontend**: http://localhost/visitor-management/frontend/
- **API**: http://localhost/visitor-management/backend/api/visitors.php
- **Database**: http://localhost/phpmyadmin

## Directory Structure
```
C:\xampp\htdocs\visitor-management\
├── frontend/              (React build files)
│   ├── index.html
│   ├── static/
│   └── assets/
├── backend/
│   ├── config/
│   │   └── database.php
│   ├── api/
│   │   └── visitors.php
│   └── database/
│       └── visitor_management.sql
└── SETUP_INSTRUCTIONS.md
```

## API Endpoints

### Check-in Visitor
**POST** `/api/visitors.php?action=checkin`
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+1234567890",
  "company": "Example Corp",
  "hostName": "Jane Smith",
  "purpose": "Business meeting",
  "department": "Sales"
}
```

### Check-out Visitor
**PUT** `/api/visitors.php?action=checkout`
```json
{
  "visitor_id": 123
}
```

### Get Active Visitors
**GET** `/api/visitors.php?action=active`

### Get Visitor History
**GET** `/api/visitors.php?action=history&limit=50&offset=0&status=all&search=`

### Get Analytics
**GET** `/api/visitors.php?action=analytics`

## Database Schema

### Main Tables:
- **visitors** - Core visitor records with check-in/out times
- **visitor_logs** - Activity audit trail
- **departments** - Department information
- **hosts** - Employee/host directory
- **visitor_types** - Visitor categorization
- **system_settings** - Application configuration
- **blacklisted_visitors** - Security blacklist

### Key Features:
- Complete audit trail of all visitor activities
- Flexible search and filtering capabilities
- Automated duration calculation
- Department-based visitor distribution
- Built-in analytics and reporting
- Security features including blacklist management

## Troubleshooting

### Common Issues:

**1. CORS Errors:**
- Check that Apache is running in XAMPP
- Verify the API URL in `src/lib/api.ts`
- Ensure CORS headers are set in `visitors.php`

**2. Database Connection Failed:**
- Verify MySQL is running in XAMPP Control Panel
- Check database credentials in `backend/config/database.php`
- Ensure database `visitor_management` exists in phpMyAdmin

**3. 404 Errors:**
- Check file paths match the directory structure
- Verify files are in the correct XAMPP htdocs location
- Ensure Apache is running

**4. Build Errors:**
- Run `npm install` to install dependencies
- Check for TypeScript errors: `npm run type-check`
- Ensure all imports are correct

### Testing Steps:

1. **Test Database**: Open phpMyAdmin and verify tables exist
2. **Test API**: Visit API URL directly and check for JSON response
3. **Test Frontend**: Check browser console for any JavaScript errors
4. **Test Integration**: Try checking in a visitor and verify it appears in database

## Production Considerations

For production deployment:
1. **Security**: Change database credentials, add input validation
2. **Performance**: Enable database indexing, add caching
3. **Backup**: Set up automated database backups
4. **Monitoring**: Add error logging and monitoring
5. **SSL**: Configure HTTPS certificates
6. **Email**: Set up SMTP for host notifications (optional feature)

## Support

If you encounter issues:
1. Check XAMPP error logs: `C:\xampp\apache\logs\error.log`
2. Check browser developer console for JavaScript errors
3. Verify database connectivity in phpMyAdmin
4. Test API endpoints individually using tools like Postman

## Next Steps

The system is now fully functional with:
- Professional visitor check-in interface
- Real-time active visitor management
- Complete visitor history and search
- Analytics dashboard with charts
- Secure PHP backend with MySQL
- Complete audit trail

You can extend the system by adding:
- Email notifications to hosts
- Visitor badge printing
- Photo capture integration
- Mobile app for hosts
- Advanced reporting features
- Integration with access control systems

---

**Your visitor management system is now ready for use!** 🎉
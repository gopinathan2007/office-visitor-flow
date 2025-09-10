# Visitor Management System - Backend Setup Guide

## XAMPP Installation and Setup Instructions

### Prerequisites
1. **XAMPP** installed on Windows 11
2. **Git** (optional, for version control)

### Step 1: Install XAMPP
1. Download XAMPP from [https://www.apachefriends.org/](https://www.apachefriends.org/)
2. Install XAMPP in `C:\xampp\` (default location)
3. Start Apache and MySQL services from XAMPP Control Panel

### Step 2: Setup Project Directory
1. Create project folder in XAMPP htdocs:
   ```
   C:\xampp\htdocs\visitor-management\
   ```

2. Copy your React build files to:
   ```
   C:\xampp\htdocs\visitor-management\frontend\
   ```

3. Copy backend PHP files to:
   ```
   C:\xampp\htdocs\visitor-management\backend\
   ```

### Step 3: Directory Structure
Your project should look like this:
```
C:\xampp\htdocs\visitor-management\
├── frontend/                 (React build files)
│   ├── index.html
│   ├── static/
│   └── ...
├── backend/
│   ├── config/
│   │   └── database.php
│   ├── api/
│   │   └── visitors.php
│   ├── database/
│   │   └── visitor_management.sql
│   └── README.md
└── .htaccess (optional)
```

### Step 4: Database Setup
1. Open phpMyAdmin: `http://localhost/phpmyadmin`
2. Create new database or import the SQL file
3. Option A - Import SQL file:
   - Click "Import" tab
   - Choose `visitor_management.sql` file
   - Click "Go"
4. Option B - Manual creation:
   - Copy and paste the SQL commands from `visitor_management.sql`
   - Execute them one by one

### Step 5: Configure Database Connection
1. Edit `backend/config/database.php`
2. Update database credentials if needed:
   ```php
   private $host = "localhost";
   private $db_name = "visitor_management";
   private $username = "root";        // Default XAMPP MySQL username
   private $password = "";            // Default XAMPP MySQL password (empty)
   ```

### Step 6: Test Backend API
Test your API endpoints:

1. **Get all visitors:**
   ```
   http://localhost/visitor-management/backend/api/visitors.php
   ```

2. **Get active visitors:**
   ```
   http://localhost/visitor-management/backend/api/visitors.php?action=active
   ```

3. **Get visitor history:**
   ```
   http://localhost/visitor-management/backend/api/visitors.php?action=history
   ```

4. **Get analytics:**
   ```
   http://localhost/visitor-management/backend/api/visitors.php?action=analytics
   ```

### Step 7: Update React App Configuration
Update your React app to use the correct API endpoint:

1. Create a `.env` file in your React project root:
   ```
   REACT_APP_API_URL=http://localhost/visitor-management/backend/api
   ```

2. Or update your API calls to use:
   ```javascript
   const API_BASE_URL = 'http://localhost/visitor-management/backend/api';
   ```

### Step 8: Build and Deploy React App
1. Build your React app:
   ```bash
   npm run build
   ```

2. Copy build files to XAMPP:
   ```
   Copy contents of build/ to C:\xampp\htdocs\visitor-management\frontend\
   ```

### Step 9: Configure Apache (Optional)
Create `.htaccess` file in the root directory for better URL handling:

```apache
RewriteEngine On

# Handle React Router (frontend)
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteCond %{REQUEST_URI} !^/visitor-management/backend/
RewriteRule ^(.*)$ /visitor-management/frontend/index.html [L]

# Handle API requests
RewriteRule ^api/(.*)$ /visitor-management/backend/api/$1 [L]
```

## API Endpoints

### Check-in Visitor
- **POST** `/api/visitors.php?action=checkin`
- **Body:**
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
- **PUT** `/api/visitors.php?action=checkout`
- **Body:**
  ```json
  {
    "visitor_id": 123
  }
  ```

### Get Active Visitors
- **GET** `/api/visitors.php?action=active`

### Get Visitor History
- **GET** `/api/visitors.php?action=history&limit=50&offset=0&status=all&search=`

### Get Analytics
- **GET** `/api/visitors.php?action=analytics`

## Database Tables

### Main Tables:
1. **visitors** - Main visitor records
2. **visitor_logs** - Activity audit trail
3. **departments** - Department information
4. **hosts** - Employee/host information
5. **visitor_types** - Visitor categorization
6. **system_settings** - Application settings
7. **blacklisted_visitors** - Blocked visitors

### Key Features:
- **Audit Trail** - All visitor activities are logged
- **Flexible Search** - Search by name, company, or host
- **Analytics** - Daily/weekly/monthly visitor statistics
- **Department Tracking** - Visitor distribution by department
- **Duration Tracking** - Automatic visit duration calculation
- **Status Management** - Active, checked-out, no-show statuses

## Security Notes

1. **Input Validation** - All inputs are validated and sanitized
2. **SQL Injection Protection** - Using prepared statements
3. **CORS Headers** - Configured for your React app domain
4. **Error Handling** - Comprehensive error handling and logging

## Troubleshooting

### Common Issues:

1. **CORS Errors:**
   - Check the CORS headers in `visitors.php`
   - Ensure React app URL matches the allowed origin

2. **Database Connection Failed:**
   - Verify MySQL is running in XAMPP
   - Check database credentials in `database.php`
   - Ensure database `visitor_management` exists

3. **404 Errors:**
   - Check file paths and directory structure
   - Verify Apache is running
   - Check `.htaccess` configuration

4. **Permission Errors:**
   - Ensure XAMPP has proper file permissions
   - Run XAMPP as administrator if needed

### Testing the Setup:

1. Visit: `http://localhost/visitor-management/frontend/`
2. Test API directly: `http://localhost/visitor-management/backend/api/visitors.php`
3. Check phpMyAdmin: `http://localhost/phpmyadmin`

## Production Deployment Notes

For production deployment:
1. Change database credentials
2. Update CORS headers for your domain
3. Enable error logging
4. Set up SSL certificates
5. Configure proper file permissions
6. Set up automated backups
7. Configure email notifications (optional)

## Support

If you encounter issues:
1. Check XAMPP error logs: `C:\xampp\apache\logs\error.log`
2. Check PHP error logs
3. Verify database connections in phpMyAdmin
4. Test API endpoints individually